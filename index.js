#!/usr/bin/env node
'use strict'
const franc = require('franc')
const getStdin = require('get-stdin')
const hljs = require('highlight.js')
const iso639 = require('iso-639-3')
const pandoc = require('pandoc-filter')

const shortLang = {}
for (const {iso6391, iso6393} of iso639) shortLang[iso6393] = iso6391

// programming languages roughly sorted by popularity
const codeLangs = [
  'diff',
  'markdown',
  'json',
  'yaml',
  'javascript',
  'java',
  'python',
  'css',
  'html',
  'php',
  'ruby',
  'makefile',
  'cpp',
  'c',
  'bash',
  'cs',
  'objectivec',
  'r',
  'go',
  'perl',
  'coffee',
  'latex',
  'bibtex',
  'swift',
  'scala',
  'haskell',
  'lua',
  'clojure',
  'matlab',
  'groovy',
  'puppet',
  'rust',
  'kotlin',
  'powershell',
  'erlang',
  'vb',
  'typescript',
  'xml',
  'xslt',
  'actionscript',
  'asp',
  'ocaml',
  'd',
  'scheme',
  'dart',
  'commonlisp',
  'julia',
  'fsharp',
  'elixir',
  'fortran',
  'haxe'
]

function MetaInlines (...args) {
  return {t: 'MetaInlines', c: args}
}

let words = []

function action (key, value, format, meta) {
  switch (key) {
    case 'CodeBlock': return codeblock(...value)
    case 'Space': words.push(' '); break
    case 'Str': words.push(value); break
  }
}

function codeblock ([id, classes, attrs], content) {
  if (classes.join() === 'highlight') {
    let {language, relevance} = hljs.highlightAuto(content, codeLangs)
    classes = (relevance > 25) ? [language] : []
    return pandoc.CodeBlock([id, classes, attrs], content)
  }
}

getStdin().then(str => {
  let data = JSON.parse(str)
  let format = (process.argv.length > 2) ? process.argv[2] : ''
  let meta = data.meta || data[0].unMeta
  let output = pandoc.walk(data, action, format, meta)
  let lang = franc(words.join(''))
  if (shortLang[lang]) lang = shortLang[lang]
  output.meta.lang = MetaInlines(pandoc.Str(lang))
  process.stdout.write(JSON.stringify(output))
})
