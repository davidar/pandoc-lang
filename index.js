#!/usr/bin/env node
import { franc } from 'franc'
import getStdin from 'get-stdin'
import hljs from 'highlight.js'
import { iso6393To1 } from 'iso-639-3'
import pandoc from 'pandoc-filter'

const shortLang = iso6393To1

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
  return { t: 'MetaInlines', c: args }
}

const words = []

function action (el) {
  switch (el.t) {
    case 'CodeBlock': return codeblock(...el.c)
    case 'Space': words.push(' '); break
    case 'Str': words.push(el.c); break
  }
}

function codeblock ([id, classes, attrs], content) {
  if (classes.join() === 'highlight') {
    const { language, relevance } = hljs.highlightAuto(content, codeLangs)
    classes = (relevance > 25) ? [language] : []
    return pandoc.CodeBlock([id, classes, attrs], content)
  }
}

getStdin().then(async str => {
  const data = JSON.parse(str)
  const format = (process.argv.length > 2) ? process.argv[2] : ''
  const meta = data.meta || data[0].unMeta
  const output = await pandoc.walk(data, action, format, meta)
  let lang = franc(words.join(''))
  if (shortLang[lang]) lang = shortLang[lang]
  output.meta.lang = MetaInlines(pandoc.Str(lang))
  process.stdout.write(JSON.stringify(output))
})
