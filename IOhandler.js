/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date: 07/11/2023
 * Author: Aless (Tong-Wen Wei)
 *
 */

const { mainModule } = require("process");
const { Transform, Readable, pipeline } = require("stream");

const admZip = require("adm-zip"),
  fs = require("fs"),
  { readdir } = require("fs/promises"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */

const unzip = (pathIn, pathOut) => {
  const zip = new admZip(pathIn);

  try {
    zip.extractAllTo(pathOut, true); // true: will overwite the file during the unzip function to a new directory
    console.log("Extraction operation complete");
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

// no need the catch because there will be a catch at the end of the main.js
// unzip("myfile.zip", "unzip");
/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const isPng = (file) => {
  if (file.endsWith(".png")) {
    return true;
  } else {
    return false;
  }
};
const readDir = (dir) => {
  let names = [];
  return readdir(dir).then((filenames) => {
    for (let filename of filenames) {
      if (isPng(filename)) {
        // path.join
        const fullPath = path.join(process.cwd(), "/unzipped/", filename);
        names.push(fullPath);
      }
    }
    return names;
  });
};

// readDir("./unzip").then((d) => console.log(d));

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScaleCal = (image, filter) => {
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const idx = (image.width * y + x) << 2;
      applyFilter(image.data, idx, filter);
    }
  }
};

const applyFilter = (pixelData, idx, filter) => {
  switch (filter) {
    case "grayscale":
      const gray =
        (pixelData[idx] + pixelData[idx + 1] + pixelData[idx + 2]) / 3;
      for (let i = 0; i < 3; i++) {
        pixelData[idx + i] = gray;
      }
      break;
    case "hefe":
      pixelData[idx] = Math.min(255, pixelData[idx] * 1.2);
      pixelData[idx + 1] = Math.min(255, pixelData[idx + 1] * 0.8);
      pixelData[idx + 2] = Math.min(255, pixelData[idx + 2] * 0.5);
  }
};

const grayScale = (pathIn, pathOut, filter) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(pathIn)
      .pipe(new PNG())
      .on("parsed", function () {
        grayScaleCal(this, filter);

        this.pack().pipe(
          fs.createWriteStream(pathOut).on("close", () => {
            console.log(`sucess with ${pathIn}`);
            resolve();
          })
        );
      })
      .on("error", (err) => reject(err));
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
