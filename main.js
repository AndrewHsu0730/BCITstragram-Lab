const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description: Entry point to the program
 *
 * Created Date: 2024-2-12
 * Author: Chu-Hsiang (Andrew) Hsu
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
    .then(() => IOhandler.readDir(pathUnzipped))
    .then((imgs) => IOhandler.grayScale(imgs, pathProcessed))