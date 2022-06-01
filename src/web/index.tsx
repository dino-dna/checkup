import { Checkup, CheckupProps } from "./components/Checkup";
import { delay } from "bluebird";
import { FromServer, FromUi } from "../messages";
import { h, render as renderToDOM } from "preact";
import { LogMsg, Logger, AppState } from "../interfaces";
import { Themes } from "./reducers/theme";
import * as configure from "../configure";
import { ipcRenderer } from "electron";

const log: Logger = (log) =>
  ipcRenderer.send("bus", FromUi.LOG, {
    processName: "renderer",
    ...log,
  } as LogMsg);

// @debug - loud log mode
// setInterval(() => log({ level: "info", message: "get loud! "}), 20)

const onConfigure = () =>
  ipcRenderer.send("bus", FromUi.REQUEST_OPEN_CONFIG_FOLDER);

const onIssue = () => {
  window
    .require("electron")
    .ipcRenderer.send("bus", FromUi.REQUEST_OPEN_ISSUE_URL);
};

const onOpenLog = () => {
  window
    .require("electron")
    .ipcRenderer.send("bus", FromUi.REQUEST_OPEN_LOG_FILE);
};

const onToggleTheme = (theme: Themes) => {
  window
    .require("electron")
    .ipcRenderer.send("bus", FromUi.REQUEST_SET_THEME, theme);
};

const onSnooze = (jobName: string) =>
  window
    .require("electron")
    .ipcRenderer.send("bus", FromUi.TOGGLE_SNOOZE_JOB, { jobName });

const refreshMainState = async (): Promise<void> => {
  const nextState: AppState | null = JSON.parse(
    await ipcRenderer.invoke("configure:getAppState")
  );
  debugger;
  if (!nextState) {
    return delay(100).then(refreshMainState);
  }
  state.main = nextState;
  if (state.main) {
    for (const job of Object.values(state.main.jobs)) {
      if (!job || !job.name) {
        return log({ level: "error", message: "unable to extract job" });
      }
    }
  }
  render();
};

ipcRenderer.on("bus", (_, msg) => {
  log({ level: "verbose", message: `received ${msg}` });
  switch (msg) {
    case FromServer.STATE_UPDATED:
      return refreshMainState();
    default:
      throw new Error(`unsupported msg: ${msg}`);
  }
});

const state: CheckupProps["state"] = {
  main: null,
};

const render = () =>
  renderToDOM(
    <Checkup
      onConfigure={onConfigure}
      onSnooze={onSnooze}
      onIssue={onIssue}
      onOpenLog={onOpenLog}
      onToggleTheme={onToggleTheme}
      state={state}
    />,
    document.getElementById("app")!
  );

refreshMainState();
