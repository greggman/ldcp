const path = require('path');
const fs = require('fs');

const defaultAPI = {
  copyFileSync(...args) { return fs.copyFileSync(...args) },
  mkdirSync(...args) { return fs.mkdirSync(...args); },
  statSync(...args) { return fs.statSync(...args); },
  readdirSync(...args) { return fs.readdirSync(...args); },
  log() {},
};

function ldcp(_srcs, dst, options, api = defaultAPI) {
  const {recurse} = options;

  // check if dst is or needs to be a directory
  const dstStat = safeStat(dst);
  let isDstDirectory = false;
  let needMakeDir = false;
  if (dstStat) {
    isDstDirectory = dstStat.isDirectory();
  } else {
    isDstDirectory = recurse;
    needMakeDir = recurse;
  }

  if (!recurse && _srcs.length > 1 && !isDstDirectory) {
    throw new Error('can not copy multiple files to same dst file');
  }

  const srcs = [];

  // handle the case where src ends with / like cp
  for (const src of _srcs) {
    if (recurse) {
      const srcStat = safeStat(src);
      if ((needMakeDir && srcStat && srcStat.isDirectory()) || 
          (src.endsWith('/') || src.endsWith('\\'))) {
        srcs.push(...api.readdirSync(src).map(f => path.join(src, f)));
        continue;
      }
    }
    srcs.push(src);
  }

  const srcDsts = [{srcs, dst, isDstDirectory, needMakeDir}];

  while (srcDsts.length) {
    const {srcs, dst, isDstDirectory, needMakeDir} = srcDsts.shift();

    if (needMakeDir) {
      api.log('mkdir', dst);
      api.mkdirSync(dst);
    }

    for (const src of srcs) {
      const dstFilename = isDstDirectory ? path.join(dst, path.basename(src)) : dst;
      if (recurse) {
        const srcStat = api.statSync(src);
        if (srcStat.isDirectory()) {
          srcDsts.push({
              srcs: api.readdirSync(src).map(f => path.join(src, f)),
              dst: path.join(dst, path.basename(src)),
              isDstDirectory: true,
              needMakeDir: true,
          });
          continue;
        }
      }
      api.log('copy', src, dstFilename);
      api.copyFileSync(src, dstFilename);
    }
  }

  function safeStat(filename) {
    try {
      return api.statSync(filename.replace(/(\\|\/)$/, ''));
    } catch (e) {
      //
    }
  }
}

module.exports = ldcp;

