import fs from "node:fs";
import FileFilter from "@ryn-bsd/file-processing/helper/filter.js";
import FileTmp from "@ryn-bsd/file-processing/helper/tmp.js";
import path from "node:path";

export default class FileUploader {
  static readonly PUBLIC = "public";
  private readonly files: Buffer[];

  constructor(...files: Buffer[]) {
    this.files = files;
  }

  private async filter() {
    const mimes = await Promise.all(this.files.map((file) => FileFilter.mime(file)));

    const result: { mime: string; file: Buffer }[] = [];
    for (const index in mimes) {
      const mime = mimes[index];
      if (typeof mime === "undefined") continue;
      result.push({ mime, file: this.files[index]! });
    }

    return result;
  }

  private async checkDir(type: string) {
    const dir = path.join(__root, FileUploader.PUBLIC, type);
    if (fs.existsSync(dir)) return dir;
    await fs.promises.mkdir(dir);
    return dir;
  }

  async upload() {
    const filtered = await this.filter();
    return Promise.all(
      filtered.map(async (element) => {
        const type = element.mime.split("/")[0]!;
        const dir = await this.checkDir(type);
        const ext = (await FileFilter.extension(element.file))!;

        const fileName = FileTmp.generateFileName(ext);
        const fullPath = path.join(dir, fileName);
        await fs.promises.writeFile(fullPath, element.file);

        return path.join(type, fileName);
      }),
    );
  }

  static async remove(...uris: string[]) {
    await Promise.all(
      uris.map(async (uri) => {
        const fullPath = path.join(__root, FileUploader.PUBLIC, uri);
        return fs.promises.unlink(fullPath);
      }),
    );
  }
}
