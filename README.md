# ldcp (low dependency cp)

Why? Because a popular cp clone in node is 450k lines of JavaScript!!! You read that right. 450,000!!!!

This one is 133 lines and has no dependencies.

It tries to do the same as `cp` though it only supports the `-R` option.

Like `cp`

* with just 2 arguments, copies a single file from src to dst

* with `-R` if the source ends with `/` the contents of source

  In other words assume have


    ```
    abc
     +--def.txt
     +--ghi.txt
    ```

  then

    ```
    ldcp -R abc xyz
    ```

  results in

    ```
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
    xyz
      +--def.txt
      +--ghi.txt
    ```

## Usage

   ldcp [-R] src_file dst_file
   lcdp [-r] src_file ... dst_directory

## options

* `-R` recursive copy

* `--dry-run` show what it would do

* `--verbose` print what it's doing
