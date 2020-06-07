import { menubar, Menubar } from "menubar";
import Electron from "electron";
import { prodWebIndex, isDev } from "./env";
import { resolve, dirname } from "path";
import { Status, AppState, IconTheme } from "./interfaces";

type NextIconToolkit = {
  degrees: number;
  electron: typeof Electron;
  iconTheme: IconTheme;
  mb: Menubar;
  status: Status;
};

export const getStatusIcon = (
  nativeImage: typeof Electron["nativeImage"],
  iconTheme: IconTheme = "stencil_dark",
  status: Status,
  degrees?: number
) => {
  const iconFilename = resolve(
    ...[
      __dirname,
      "..",
      "assets",
      "iconTheme",
      iconTheme,
      "status",
      degrees ? status : "",
      `${status}${degrees ? "_" + degrees.toString() : ""}.png`,
    ].filter((i) => i)
  );
  return nativeImage
    .createFromPath(iconFilename)
    .resize({ width: 16, height: 16 });
};

let rotateIconTimer: NodeJS.Timer | null = null;
export const rotateStatusIcon = ({
  electron,
  degrees,
  iconTheme,
  mb,
  status,
}: NextIconToolkit) =>
  setTimeout(() => {
    const img = getStatusIcon(electron.nativeImage, iconTheme, status, degrees);
    mb.tray.setImage(img);
    const nextDegrees = degrees === 110 ? 0 : degrees + 10;
    if (!rotateIconTimer) return;
    rotateIconTimer = rotateStatusIcon({
      electron,
      degrees: nextDegrees,
      iconTheme,
      mb,
      status,
    });
  }, 100);

/**
 * all tray updates *must* use this function, and never directly
 * call mb.tray.setImage.  otherwise, icon animation will compete with
 * other callers.
 */
export const setTrayImage = ({
  electron,
  iconTheme,
  status,
  mb,
}: Omit<NextIconToolkit, "degrees">) => {
  const img = getStatusIcon(electron.nativeImage, iconTheme, status);
  if (status === "pending") {
    if (rotateIconTimer) return;
    if (iconTheme === "stencil_dark" || iconTheme === "stencil") {
      mb.tray.setImage(img);
      return (rotateIconTimer = rotateStatusIcon({
        electron,
        iconTheme,
        mb,
        degrees: 0,
        status,
      }));
    }
    // fall through iff pending status has no supporting animation sprite kit!
  }
  clearTimeout(rotateIconTimer!);
  rotateIconTimer = null;
  mb.tray.setImage(img);
};

export function create({
  appState,
  electron,
}: {
  electron: typeof Electron;
  appState: AppState;
}) {
  const icon = getStatusIcon(electron.nativeImage, appState.iconTheme, "ok");
  const dir = dirname(prodWebIndex);
  const mb = menubar({
    browserWindow: {
      darkTheme: true,
      frame: isDev,
      show: isDev,
      transparent: false,
      width: isDev ? 1000 : 450,
      height: isDev ? 1000 : 400,
      y: 24,
      webPreferences: {
        devTools: isDev,
        nodeIntegration: true,
      },
    },
    dir,
    icon,
    preloadWindow: isDev,
  });
  mb.on("ready", () => {
    isDev && (mb as any)._browserWindow.openDevTools();
  });
  return mb;
}
