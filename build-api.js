/**
 * Generate files for examples-api to `dist` folder
 *
 * API ENDPOINTS
 *
 *     Get a list of example names in zeit/now-examples
 *     /_api/list.json
 *
 *     Get detailed list of all examples
 *     /_api/manifest.json
 *
 *     Download example files by name (e.g. "apollo")
 *     /_api/download/apollo.tar.gz
 */

const debuglog = require('util').debuglog('API_BUILDER')
const { lstatSync, readdirSync, createWriteStream } = require('fs')
const { join } = require('path')
const fse = require('fs-extra')
const tar = require('tar-fs')

main()

async function main () {
  const dist = join(__dirname, 'dist')
  await fse.emptyDir(dist)

  const examples = collectExampleNames(__dirname)
  debuglog(examples)

  // Generate `list.json`
  await fse.ensureDir(join(dist, '_api'))
  await fse.writeJSON(join(dist, '_api/list.json'), examples)

  // Generate 'download/*.tar.gz'
  await fse.ensureDir(join(dist, '_api/download'))
  await generateDownloads(__dirname, examples, join(dist, '_api/download'))

  // Copy `manifest.json`
  const target = join(__dirname, 'dist/_api/manifest.json')
  await fse.copy(join(__dirname, 'manifest.json'), target)
}

async function generateDownloads (cwd, examples, downloadDir) {
  await fse.ensureDir(downloadDir)

  return Promise.all(examples.map(example => {
    return createTarball(join(cwd, example), join(downloadDir, `${example}.tar.gz`))
  }))
}

async function createTarball (dir, dest) {
  debuglog(`Creating ${dest}`)

  return new Promise((resolve, reject) => {
    const stream = tar.pack(dir).pipe(createWriteStream(dest))
    stream.on('close', resolve)
    stream.on('error', reject)
  })
}

function collectExampleNames (cwd) {
  const ignores = fse.readFileSync(join(cwd, '.gitignore'), 'utf8').split('\n')

  return readdirSync(cwd)
  .filter(name => !isDotFile(name))
  .filter(name => isDirectory(join(cwd, name)))
  .filter(name => !ignores.includes(name))
}

const isDotFile = name => name.startsWith('.')
const isDirectory = path => lstatSync(path).isDirectory()

process.on('unhandledRejection', error => {
  console.error(error)
  throw error
})
