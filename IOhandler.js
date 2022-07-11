/*
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs").promises,
  PNG = require("pngjs").PNG,
  { createReadStream, createWriteStream } = require("fs")


/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return createReadStream(pathIn)
    .pipe(unzipper.Extract({ path: pathOut })).promise();   
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return fs.readdir(dir);
};

//Constants for color ratios
const redCo = 0.2126,
  greenCo = 0.7152,
  blueCo = 0.0722;

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    createReadStream(pathIn)
      .pipe(
        new PNG({
          filterType: 4,
        })
      )
      .on("parsed", function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;

            let gray = (this.data[idx] * redCo)
              + (this.data[idx + 1] * greenCo)
              + (this.data[idx + 2] * blueCo)

            // Gray scale
            this.data[idx] = gray;
            this.data[idx + 1] = gray;
            this.data[idx + 2] = gray;

            this.data[idx + 3] = 255;
          }
        }

        this.pack().pipe(createWriteStream(pathOut));
      })
      .on('error', reject)
      .on('done', resolve);
  });

};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
