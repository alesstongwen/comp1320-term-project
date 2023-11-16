const { IncomingMessage } = require("http");
const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author: Aless (Tong-Wen Wei)
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((images) => {
    Promise.all([
      images.forEach((img) => {
        const filename = path.basename(img);
        const outPath = path.join(pathProcessed, filename);
        IOhandler.grayScale(
          img,
          outPath,
          "grayscale" // insert filter name
        );
      }),
    ]);
  })

  // now the last .then() will run after only one image is completed -> use promise.all(): takes an array of items that are going to resolve
  .then(() => console.log("All images filtered!"))
  .catch((err) => console.log(err));
