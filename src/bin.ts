import { app, ipcMain, nativeTheme, shell } from "electron";
import { create as createMenubar } from "./menubar";
import {
  debouncedReload,
  edit,
  getConfigDir,
  getConfigFilename,
  openLogFile,
  setTheme,
  upsertConfigDir,
} from "./configure";
import { AppState, Logger } from "./interfaces";
import { create } from "./app.actions";
import { FromUi } from "./messages";
import { createLogger } from "./logger";
import moment = require("moment");

const pkg = require("../package.json");

const processLog = createLogger({
  dirname: getConfigDir(),
});
const log: Logger = (log) => processLog({ ...log, processName: "main" });

app.on("ready", async () => {
  // @warn `import electron ...` init's some powerModule
  // which crashes if done before `'ready'`
  log({ level: "info", message: "app ready" });
  const electron = require("electron");
  await upsertConfigDir();
  log({ level: "verbose", message: "config directory created" });
  const appState: AppState = {
    actions: {} as any, // hacks
    state: "OK",
    iconTheme: nativeTheme.shouldUseDarkColors ? "stencil_dark" : "stencil",
    jobs: {},
  };
  const mb = createMenubar({ appState, electron });
  appState.actions = create({
    log,
    appState,
    electron,
    menubar: mb,
  });
  ["after-hide", "after-show", "open"].map((eventName) => {
    log({ level: "verbose", message: `event "${eventName}" triggered` });
    mb.on(eventName, () => reloadConfig(appState));
  });
  const snoozeJob = (jobName: string) => {
    const job = appState.jobs[jobName];
    if (!job) return log({ level: "warn", message: "job not found to snooze" });
    if (job.state.status === "snoozed") {
      // purge job, reload it. lazy/hacky way to de-snooze
      delete appState.jobs[jobName];
      return reloadConfig(appState);
    } else {
      job.state.status = "snoozed";
      job.state.snoozedUntilIsoStr = moment().add(24, "hours").toISOString();
    }
    job.state.message = "";
    appState.actions.onStateUpdated();
  };
  reloadConfig(appState);
  ipcMain.on("bus", (_, msg: FromUi, payload: any) => {
    switch (msg) {
      case FromUi.REQUEST_OPEN_CONFIG_FOLDER:
        return edit(electron);
      case FromUi.REQUEST_OPEN_LOG_FILE:
        return openLogFile(electron);
      case FromUi.LOG:
        return processLog(payload);
      case FromUi.REQUEST_OPEN_ISSUE_URL:
        return shell.openExternal(pkg.bugs);
      case FromUi.REQUEST_SET_THEME:
        return setTheme(payload);
      case FromUi.TOGGLE_SNOOZE_JOB:
        return snoozeJob(payload.jobName);
      default:
        throw new Error(`unsupported message from ui: ${msg}`);
    }
  });
});

const reloadConfig = (appState: AppState) =>
  debouncedReload({ appState, configFilename: getConfigFilename(), log })
    .then(() => {
      appState.state = "OK";
      appState.errorMessage = "";
    })
    .catch((err: Error) => {
      log({ level: "error", message: err.message });
      appState.state = "BAD_CONFIG_FILE";
      appState.errorMessage = err.message;
    })
    .then(() => appState.actions.onStateUpdated());
