import { access } from "fs-extra";

export const getFirstExistingFilename = async (...filenames: string[]) => {
  let isAccessible = false;
  for (const filename of filenames) {
    await access(filename)
      .then(() => {
        isAccessible = true;
      })
      .catch(() => {});
    if (isAccessible) return filename;
  }
  throw new Error("no filenames accessible");
};
