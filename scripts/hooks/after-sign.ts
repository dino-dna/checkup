// See: https://medium.com/@TwitterArchiveEraser/notarize-electron-apps-7a5f988406db
import fs from "fs";
import path from "path";
import { notarize } from "electron-notarize";

const pkg = require("../../package.json");

module.exports = async function maybeNotarize(params: any) {
  if (process.env.NODE_ENV === "development") {
    return console.warn("skipping notarization, NODE_ENV=development");
  }
  if (process.platform !== "darwin") {
    return console.warn("skipping notarization, not OSX Darwin");
  }
  console.log("afterSign hook triggered", params);

  const appBundleId: string = pkg.build.appId;
  if (!appBundleId) throw new Error("no appBundleId found in package.json");
  const appPath = path.join(
    params.appOutDir,
    `${params.packager.appInfo.productFilename}.app`
  );
  if (!fs.existsSync(appPath)) {
    throw new Error(`Cannot find application at: ${appPath}`);
  }
  console.log(`Notarizing ${appBundleId} found at ${appPath}`);
  const appleId = process.env.AID;
  if (!appleId) throw new Error("no appleid found");
  const appleIdPassword = process.env.AIP;
  if (!appleIdPassword) throw new Error("no appleIdPassword found");
  await notarize({
    appBundleId,
    appPath,
    appleId,
    appleIdPassword,
  }).catch((err: Error) => {
    console.error(
      `failed to notarize: ${err ? err.message : "NO ERROR MESSAGE FOUND"}`
    );
    throw err;
  });
  console.log(`Done notarizing ${appBundleId}`);
};
