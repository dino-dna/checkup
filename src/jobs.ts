import {
  AppState,
  ConfigureFn,
  IconTheme,
  JobsByName,
  Logger,
  UserConfig,
} from "./interfaces";
import { getFirstExistingFilename } from "./files";
import * as fs from "fs-extra";
import execa from "execa";
import moment from "moment";
import fetch from "node-fetch";
const nodeEval = require("node-eval");

const onStartPoll: (opts: {
  jobs: JobsByName;
  name: string;
  log: Logger;
  actions: AppState["actions"];
}) => Promise<void> = async ({ actions, jobs, name, log }) => {
  const now = new Date();
  const job = jobs[name];
  const nextPoll =
    (job as any).pollDurationMsDev || job.pollDurationMs || 60000 * 10;
  if (
    job.state.snoozedUntilIsoStr &&
    moment(job.state.snoozedUntilIsoStr).isAfter(moment(now))
  ) {
    const snoozedUntilDuration = moment.duration({
      from: moment(),
      to: moment(job.state.snoozedUntilIsoStr),
    });
    return log({
      level: "info",
      message: `job ${
        job.name
      } snoozed for another: ${snoozedUntilDuration.humanize()}`,
    });
  }
  job.state.snoozedUntilIsoStr = "";
  job.state.status = "pending";
  actions.onStateUpdated(); // notify that we have a job pending
  const jobLogger: Logger = (msg) =>
    log({
      ...msg,
      tags: msg.tags ? [...msg.tags, job.name] : [job.name],
    });
  Promise.resolve(job.fn({ log: jobLogger }))
    .then((res) => {
      if (typeof res === "string") job.state!.message = res;
      job.state.lastRunDate = now;
      job.state.lastSuccess = now;
      job.state.message = "";
      job.state.status = "ok";
    })
    .catch((err) => {
      job.state.lastFailure = now;
      job.state.message = err && err.message ? err.message : "";
      job.state.status = "not_ok";
      log({
        level: "error",
        message: err.message,
        tags: ["job-failure", job.name],
      });
    })
    .then(() => {
      const moarNow = new Date().getTime();
      const duration = ((moarNow - now.getTime()) / 1000).toFixed(1);
      log({
        level: "info",
        message: `job ${job.name} ran in ${duration}s`,
      });
      job.state!.lastRunDate = now;
      job.state.nextRunDate = new Date(now.getTime() + nextPoll);
      actions.onStateUpdated();
      job.state.nextRunTimer = setTimeout(
        () => onStartPoll({ actions, jobs, name, log }),
        nextPoll
      );
    });
};
export async function rectify({
  appState,
  log,
  configFilename,
}: {
  appState: AppState;
  configFilename: string;
  log: Logger;
}) {
  const { actions, jobs } = appState;
  const jsConfigTemplateFilename = configFilename.replace(/\.ts$/, ".js");
  const jsConfigFilename = configFilename.replace(".template.js", ".js");
  const finalJsConfigFilename = await getFirstExistingFilename(
    jsConfigFilename,
    jsConfigTemplateFilename
  );
  log({
    level: "verbose",
    message: `using config file: ${finalJsConfigFilename}`,
  });
  const createNextJobs = await fs
    .readFile(finalJsConfigFilename)
    .then((buf) => Promise.resolve(nodeEval(buf.toString())));
  if (!createNextJobs && !createNextJobs.configure) {
    throw new Error("config file must export function named configure");
  }
  const configure: ConfigureFn = createNextJobs.configure;
  const getJobsRes = configure({ execa, fetch, fs, log });
  const rawUserConfig = (await Promise.resolve(getJobsRes)) as ReturnType<
    ConfigureFn
  >;
  const userConfig: UserConfig = Array.isArray(rawUserConfig)
    ? { jobs: rawUserConfig }
    : rawUserConfig;
  const { jobs: nextJobs, theme } = userConfig;
  const themes: IconTheme[] = ["github", "stencil", "stencil_dark"];
  if (theme) {
    if (!themes.includes(theme)) {
      throw new Error(
        `invalid theme. please select from: ${themes.join(", ")}`
      );
    }
    appState.iconTheme = theme;
  }
  // NO ASYNC CODE PERMITTED AFTER THIS POINT
  // until the jobs meta object has been updated in the same, uninterrupted
  // event loop cycle
  const nextJobNames = new Set(nextJobs.map((job) => job.name));
  const currJobNames = new Set(Object.values(jobs).map((job) => job.name));
  for (const job of Object.values(nextJobs)) {
    const oldJob = jobs[job.name];
    jobs[job.name] = job;
    if (!oldJob) {
      // init new state
      log({ level: "info", message: `job "${job.name}" created` });
      job.state = { status: "pending", snoozedUntilIsoStr: "" };
      onStartPoll({
        name: job.name,
        jobs,
        actions,
        log,
      });
    } else {
      // recycle old state
      log({
        level: "info",
        message: `updating job "${job.name}", reusing current state`,
      });
      jobs[job.name] = job;
      job.state = oldJob.state;
    }
  }
  // purge removed jobs
  const toRemoveJobNames = new Set(currJobNames);
  nextJobNames.forEach((name) => {
    log({
      level: "info",
      message: `nextJobNames has job named "${name}". preventing its removal`,
    });
    toRemoveJobNames.delete(name);
  });
  const toRemoveArr = Array.from(toRemoveJobNames);
  if (toRemoveArr.length) {
    log({ level: "info", message: `removing jobs: ${toRemoveArr.join(", ")}` });
  }
  toRemoveJobNames.forEach((jobName) => {
    const job = jobs[jobName];
    clearTimeout(job.state.nextRunTimer!);
    delete jobs[jobName];
  });
}
