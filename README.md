# pandoc-lang

Pandoc filter to automatically detect the language of text, and adjust the [`lang` variable](https://pandoc.org/MANUAL.html#language-variables) in the document metadata.

It will also attempt to detect the programming language used for any code blocks that specify `highlight` as the class name.

## Installation

```sh
npm install -g pandoc-lang
```

## Usage

```sh
pandoc --filter pandoc-lang -s -t markdown test.md
```
