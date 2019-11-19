const assert = require('chai').assert;
const ldcp = require('../../src/ldcp');

describe('ldcp', () => {

  function createFSAPI(root) {

    function getCWDAndFilename(filePath) {
      let cwd = root;
      const dirs = filePath.split('/');
      const filename = dirs.pop();
      for (const dir of dirs) {
        cwd = cwd[dir];
        if (!cwd) {
          throw new Error(`no directory: ${filePath}`);
        }
      }
      return {
        cwd,
        filename,
      };
    }

    return {
      copyFileSync(src, dst) {
        const {cwd: srcD, filename: srcName} = getCWDAndFilename(src);
        const content = srcD[srcName];
        if (!content) {
          throw new Error('no file:', src);
        }
        const {cwd: dstD, filename: dstName} = getCWDAndFilename(dst);
        dstD[dstName] = content;
      },
      mkdirSync(name) { 
        const {cwd, filename} = getCWDAndFilename(name);
        if (cwd[filename]) {
          throw new Error(`file/dir already exists: ${name}`);
        }
        cwd[filename] = {};
      },
      statSync(name) {
        const {cwd, filename} = getCWDAndFilename(name);
        const content = cwd[filename];
        if (!content) {
          throw new Error(`file does not exist: ${name}`);
        }
        return {
          isDirectory() {
            return typeof(content) === 'object';
          },
        };
      },
      readdirSync(name) { 
        const {cwd, filename} = getCWDAndFilename(name.replace(/(\\|\/)$/, ''));
        const dir = cwd[filename];
        return Object.keys(dir);
      },
      log() {},
    };
  }

  it('copies a single file', () => {
    const root = {
      abc: '123',
    };
    const api = createFSAPI(root);
    ldcp(['abc'], 'def', {}, api);
    assert.deepEqual(root, {
      abc: '123',
      def: '123',
    });
  });

  it('does not copy 2 files file to non-existing folder', () => {
    const root = {
      abc: '123',
      def: '456',
    };
    const api = createFSAPI(root);
    assert.throws(() => {
      ldcp(['abc', 'def'], 'ghi', {}, api);
    });
    assert.deepEqual(root, {
      abc: '123',
      def: '456',
    });
  });

  it('copies 2 files file to folder', () => {
    const root = {
      abc: '123',
      def: '456',
      ghi: {},
    };
    const api = createFSAPI(root);
    ldcp(['abc', 'def'], 'ghi', {}, api);
    assert.deepEqual(root, {
      abc: '123',
      def: '456',
      ghi: {
        abc: '123',
        def: '456',
      },
    });
  });


  it('copies subfolder to new folder', () => {
    const root = {
      foo: {
        abc: '123',
        def: '456',
      },
    };
    const api = createFSAPI(root);
    ldcp(['foo'], 'ghi', {recurse: true}, api);
    assert.deepEqual(root, {
      foo: {
        abc: '123',
        def: '456',
      },
      ghi: {
        abc: '123',
        def: '456',
      },
    });
  });

  it('copies subfolder to existing folder', () => {
    const root = {
      foo: {
        abc: '123',
        def: '456',
      },
      ghi: {},
    };
    const api = createFSAPI(root);
    ldcp(['foo'], 'ghi', {recurse: true}, api);
    assert.deepEqual(root, {
      foo: {
        abc: '123',
        def: '456',
      },
      ghi: {
        foo: {
          abc: '123',
          def: '456',
        },
      },
    });
  });

  it('copies files from subfolder to new folder', () => {
    const root = {
      foo: {
        abc: '123',
        def: '456',
      },
    };
    const api = createFSAPI(root);
    ldcp(['foo/'], 'ghi', {recurse: true}, api);
    assert.deepEqual(root, {
      foo: {
        abc: '123',
        def: '456',
      },
      ghi: {
        abc: '123',
        def: '456',
      },
    });
  });

});