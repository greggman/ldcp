# ldcp (low dependency cp)

[![npm](https://img.shields.io/npm/v/ldcp.svg?style=flat-square)](https://www.npmjs.com/package/ldcp)
![GitHub](https://img.shields.io/github/license/greggman/ldcp?style=flat-square)
[![Build Status](https://travis-ci.org/greggman/ldcp.svg?branch=master)](https://travis-ci.org/greggman/ldcp)

Why? Because a popular cp clone in node is 46k lines of JavaScript and 197 dependencies!

This one is 148 lines and has no dependencies.

It tries to do the same as `cp` though it only supports the `-R` option.

## What's the point?

I needed to copy a file as part of my build. I can't use `cp` because that's not
cross platform (doesn't work on Windows). I'm usually on MacOS but I also run
Windows and have friends that do dev on Windows. I could have used `grunt` and
`grunt-contrib-copy` or some other giant build framework but I just wanted to
add an inline script in `package.json` like

```js
"scripts": {
  "build": "rollup && ldcp somefile dist/somefile"
}
```

I went looking for an existing solution. I'm sure it exists but the first one I
found was very popular and also 450k lines of dependencies. Ridiculous! I
actually solved the issue, copying a single file, with a 4 line .js file but
just for fun I thought I'd see how much work it would be to write a small `cp`
clone. This is result.

## Installation

```
npm install ldcp
```

## Usage

```
ldcp [-R] src_file dst_file
lcdp [-R] src_file ... dst_directory
```

## options

* `-R` recursive copy

* `--dry-run` show what it would do

* `--verbose` print what it's doing

Like `cp`

* with just 2 arguments, copies a single file from src to dst

* with `-R` if the source ends with `/` it copies the contents of source

  In other words assume you have


    ```
    +-abc
    | +-def.txt
    | +-ghi.txt
    +-xyz
    ```

  then

    ```
    ldcp -R abc xyz
    ```

  results in

    ```
    +-abc
    | +-def.txt
    | +-ghi.txt
    xyz
      +--abc
         +--def.txt
         +--ghi.txt
    ```

  where as

    ```
    ldcp -R abc/ xyz
    ```

  results in

    ```
    +-abc
    | +-def.txt
    | +-ghi.txt
    +-xyz
      +--def.txt
      +--ghi.txt
    ```

  if `xyz` does not exist

  then

    ```
    ldcp -R abc xyz
    ```

  results in

    ```
    +-abc
    | +-def.txt
    | +-ghi.txt
    xyz
      +--def.txt
      +--ghi.txt
    ```

  where as

    ```
    ldcp -R abc/ xyz
    ```

  results in

    ```
    +-abc
    | +-def.txt
    | +-ghi.txt
    +-xyz
      +--def.txt
      +--ghi.txt
    ```

## API

```
const ldcp = require('ldcp');

ldcp(['src'], 'dst', {recurse: true});
```

or

```
const fs = require('fs');
const ldcp = require('ldcp');

const api = {
  copyFileSync(...args) { return fs.copyFileSync(...args) },
  mkdirSync(...args) { return fs.mkdirSync(...args); },
  statSync(...args) { return fs.statSync(...args); },
  readdirSync(...args) { return fs.readdirSync(...args); },
  log(..args) { console.log(...args); },
};
ldcp(['src'], 'dst', {recurse: true}, api);
```
