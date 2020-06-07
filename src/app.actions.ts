import { AppState, Status, Logger } from "./interfaces";
import { FromServer } from "./messages";
import { setTrayImage } from "./menubar";
import { Menubar } from "menubar";
import Electron from "electron";

export const create = ({
  electron,
  log,
  menubar: mb,
  appState,
}: {
  electron: typeof Electron;
  log: Logger;
  menubar: Menubar;
  appState: AppState;
}) => {
  const getWindow = () => (mb as any)._browserWindow;
  return {
    onStateUpdated: () => {
      // @warn - skip in tests. electron things are missing
      if (process.env.NODE_ENV === "test") return;
      const jobStatuses = Object.values(appState.jobs).map(
        (job) => job.state.status
      );
      const trayStatus: Status =
        appState.state === "BAD_CONFIG_FILE"
          ? "not_ok"
          : !jobStatuses.length
          ? "pending"
          : jobStatuses.some((status) => status === "not_ok")
          ? "not_ok"
          : jobStatuses.some((status) => status === "pending")
          ? "pending"
          : "ok";
      setTrayImage({
        electron,
        iconTheme: appState.iconTheme,
        mb,
        status: trayStatus,
      });
      const window = getWindow();
      if (!window) {
        log({
          level: "warn",
          message: "window not found. skipping sending state update",
        });
        return;
      }
      return window.webContents.send("bus", FromServer.STATE_UPDATED);
    },
  };
};

export type AppActions = ReturnType<typeof create>;
