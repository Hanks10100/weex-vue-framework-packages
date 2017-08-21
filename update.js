const fs = require('fs')
const semver = require('semver')
const child_process = require('child_process')
const pkg = require('./package.json')

function exec (command) {
  const tasks = Array.isArray(command) ? command : [command]
  let res = ''
  tasks.forEach(function (task) {
    console.log(' =>', task)
    res = child_process.execSync(task)
  })
  return res.toString()
}

let targetVersion = process.argv[2]
let isLatest = false

if (!semver.valid(targetVersion)) {
  targetVersion = exec(`npm view weex-vue-framework version`).trim()
  isLatest = true
}

const formerVersion = pkg.devDependencies['weex-vue-framework']
if (formerVersion === targetVersion) {
  console.log(` => weex-vue-framework@${targetVersion} is already installed.`)
  process.exit()
}

exec([
  `npm install weex-vue-framework@${targetVersion} -E`
])

const filePath = `v${semver.major(targetVersion)}.${semver.minor(targetVersion)}.${semver.patch(targetVersion)}`
if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath)
}

exec([
  `cp -r node_modules/weex-vue-framework ${filePath}/v${targetVersion}`,
  `cp -r node_modules/weex-vue-framework ${filePath}/v${targetVersion}`,
])

// if (isLatest) {
//   exec([
//     `cp node_modules/weex-vue-framework/index.js ${filePath}/index.js`,
//     `cp node_modules/weex-vue-framework/index.min.js ${filePath}/index.min.js`,
//     `cp node_modules/weex-vue-framework/index.js index.js`,
//     `cp node_modules/weex-vue-framework/index.min.js index.min.js`
//   ])
// }

exec([
  `git add -A`,
  `git commit -m "add v${targetVersion}"`
])
