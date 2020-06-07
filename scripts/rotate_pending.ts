import execa from "execa";
import { resolve, dirname } from "path";

const degreeRotations = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];
for (const deg of degreeRotations) {
  for (const theme of ["stencil", "stencil_dark"]) {
    const src = `${process.cwd()}/assets/iconTheme/${theme}/status/pending.png`;
    const destDirname = resolve(dirname(src), "pending");
    execa(
      "convert",
      [
        src,
        "-background",
        "none",
        "-distort",
        "SRT",
        deg.toString(),
        resolve(destDirname, `pending_${deg}.png`),
      ],
      { stdio: "inherit" }
    );
  }
}
