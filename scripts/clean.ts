import glob from "glob";
import rimraf from "rimraf";
import path from "path";
import { promisify } from "util";

const rm = promisify(rimraf);
const glb = promisify(glob);
(async () => {
  try {
    const globs = await Promise.all(
      [
        ".cache",
        "dist",
        "dist_web",
        "{scripts,src,test}/**/*.{js,js.map}",
      ].map((p) => glb(path.resolve(__dirname, "..", p)))
    );

    const removed = await Promise.all(
      globs
        .flat()
        .reduce<Promise<string>[]>(
          (memo, p) =>
            p.includes("configure.template.js")
              ? memo
              : [...memo, rm(p).then(() => p)],
          []
        )
    );

    console.log(
      removed
        .map((p) => path.relative(path.resolve(__dirname, ".."), p))
        .join("\n")
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
