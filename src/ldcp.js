const path = require('path');

function ldcp(_srcs, dst, options, api) {
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

  const srcs = [];

  // handle the case where src ends with / like cp
  for (const src of _srcs) {
    if (recurse && (src.endsWith('/') || src.endsWith('\\'))) {
      srcs.push(...api.readdirSync(src).map(f => path.join(src, f)));
    } else {
      srcs.push(src);
    }
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
        const srcStat = fs.statSync(src);
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
      return api.statSync(filename);
    } catch (e) {
      //
    }
  }
}

module.exports = ldcp;

