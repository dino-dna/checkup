import { copyFile, mkdirp, lstat, readdir } from "fs-extra";
import path, { resolve } from "path";
import Electron from "electron";
import { debounce } from "lodash";
import { promisify } from "util";
import primitivify from "primitivify";
import settings from "electron-settings";

import { rectify } from "./jobs";
import { AppState, Logger } from "./interfaces";

const applicationConfigPath = require("application-config-path");

export const getConfigDir = () => applicationConfigPath("checkup") as string;
export const getConfigTempleateFilename = () =>
  resolve(__dirname, "configure.template.js");
export const getConfigFilename = () => resolve(getConfigDir(), "config.js");
export const upsertConfigDir = async () => {
  const configDirname = getConfigDir();
  await mkdirp(configDirname);
  const templateFilename = resolve(__dirname, "configure.template.js");
  await lstat(getConfigFilename()).catch(async (err) => {
    if (err.code === "ENOENT") {
      await copyFile(templateFilename, getConfigFilename());
    }
  });
  return configDirname;
};

export const edit = (electron: typeof Electron) =>
  electron.shell.showItemInFolder(getConfigFilename());

export const openLogFile = async (electron: typeof Electron) => {
  const files = await promisify<string, string[]>(readdir)(getConfigDir());
  const lastLogFile = files
    .sort()
    .reverse()
    .find((f) => /^checkup.log.[^(gz)]*$/.test(f));

  if (!lastLogFile) {
    throw new Error("Could not find log files");
  }

  electron.shell.showItemInFolder(path.join(getConfigDir(), lastLogFile));
};

let dangerousAppStateRef: null | AppState = null;
export const getState = () => dangerousAppStateRef;
export const getJsonState = () =>
  JSON.stringify(
    primitivify(getState(), (v) => (v instanceof Date ? v.toISOString() : v))
  );

export const reload = ({
  appState,
  configFilename,
  log,
}: {
  appState: AppState;
  configFilename: string;
  log: Logger;
}) => {
  dangerousAppStateRef = appState; // look away. this is for easy/hacky renderer/main io
  // const res = compile([configFilename], {
  //   noEmitOnError: true,
  //   noImplicitAny: false,
  //   sourceMap: isDev,
  //   esModuleInterop: true,
  //   target: ts.ScriptTarget.ES5,
  //   module: ts.ModuleKind.CommonJS,
  // })
  // if (res.length) throw new Error(res.join('\n'))
  return rectify({ appState, configFilename, log });
};

export const debouncedReload = debounce(reload, 1000, {
  leading: true,
  maxWait: 5000,
});

export const setTheme = (theme: any) => {
  settings.set("theme", theme);
};
