/*
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler"),
  path = require("path");
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`,
  fileExt = ".png";

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((filePaths) => {
    filePaths.forEach(filePath => {
      if(path.extname(filePath) == fileExt) {
        //console.log(path.join(pathProcessed,filePath));
        IOhandler.grayScale(path.join(pathUnzipped,filePath), path.join(pathProcessed,filePath));
      }
    })
  })
  .catch((err) => console.log(err));
