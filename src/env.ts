import { resolve } from "path";

export const isDev = !!process.env.ELECTRON_IS_DEV;
export const prodWebIndex = `${resolve(
  __dirname,
  "..",
  "dist_web",
  "index.html"
)}`;
