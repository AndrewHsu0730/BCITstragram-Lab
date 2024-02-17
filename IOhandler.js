/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: 2024-2-12
 * Author: Chu-Hsiang (Andrew) Hsu
 *
 */

const { pipeline } = require("stream/promises");

const yp = require("yauzl-promise"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = async (pathIn, pathOut) => {
  const zip = await yp.open(pathIn);
  try {
    for await (const entry of zip) {
      if (entry.filename.endsWith("/")) {
        await fs.promises.mkdir(`${pathOut}/${entry.filename}`);
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(`${pathOut}/${entry.filename}`);
        await pipeline(readStream, writeStream);
      }
    }
  } finally {
    await zip.close();
    console.log("Extraction operation complete");
  }
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((res, rej) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        rej(err);
      }
      let l = [];
      files.forEach(file => {
        if (path.extname(file).endsWith("png")) {
            l.push(file);
        }
      })
      res(l);
    })
  })
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  pathIn.forEach(img => {
    fs.createReadStream(path.join(__dirname, "unzipped", img))
      .pipe(
        new PNG({
          filterType: 4
        })
      )
      .on("parsed", function() {
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const idx = (this.width * y + x) << 2;
            const hexCode = (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;
            this.data[idx] = hexCode;
            this.data[idx + 1] = hexCode;
            this.data[idx + 2] = hexCode;
          }
        }
        this.pack().pipe(fs.createWriteStream(path.join(pathOut, img)));
      })
    })
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
