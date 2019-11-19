# ldcp (low dependency cp)

[![npm](https://img.shields.io/npm/v/ldcp.svg?style=flat-square)](https://www.npmjs.com/package/ldcp)
![GitHub](https://img.shields.io/github/license/greggman/ldcp?style=flat-square)
[![Build Status](https://travis-ci.org/greggman/ldcp.svg?branch=master)](https://travis-ci.org/greggman/ldcp)

Why? Because a popular cp clone in node is 450k lines of JavaScript!!! You read that right. 450,000!!!!

This one is 148 lines and has no dependencies.

It tries to do the same as `cp` though it only supports the `-R` option.

Like `cp`

* with just 2 arguments, copies a single file from src to dst

* with `-R` if the source ends with `/` the contents of source

  In other words assume have


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

## Usage

```
ldcp [-R] src_file dst_file
lcdp [-R] src_file ... dst_directory
```

## options

* `-R` recursive copy

* `--dry-run` show what it would do

* `--verbose` print what it's doing

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
