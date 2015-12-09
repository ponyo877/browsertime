'use strict';

let fs = require('fs'),
  path = require('path'),
  Promise = require('bluebird'),
  filters = require('./filters');

Promise.promisifyAll(fs);

/*
 Find and parse any browser scripts in rootFolder.
 Returns a Promise that resolves to an array of scripts.
 Each script is represented by an object with the following keys:
 - default: true if script is bundled with Browsertime.
 - path: the path to the script file on disk
 - source: the javascript source
 */
function parseBrowserScripts(rootFolder, isDefault) {
  function toFullPath(filename) {
    return path.join(rootFolder, filename);
  }

  function fileToScriptObject(filepath) {
    return fs.readFileAsync(filepath, 'utf8')
      .then((contents) => {
        return {
          default: isDefault,
          path: filepath,
          source: contents
        };
      });
  }

  return fs.readdirAsync(rootFolder)
    .map(toFullPath)
    .filter(filters.onlyFiles)
    .filter(filters.onlyWithExtension('.js'))
    .map(fileToScriptObject);
}

module.exports = {
  parseBrowserScripts: parseBrowserScripts,
  get defaultScripts() {
    return parseBrowserScripts(path.resolve(__dirname, '..', '..', 'browserscripts'));
  }
};