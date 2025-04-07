const fs = require('fs')
const glob = require('glob')
const path = require('path')
const uppercamelcase = require('uppercamelcase')
const template = require('./template')

const icons = []
const ICONS_PATH = 'assets/icons'
const OUTPUT_FOLDER = 'icons'

class Icon {
  constructor(iconPath) {
    this.fullName = path.basename(iconPath)
    this.componentName = uppercamelcase(`Icon-${this.getName()}`)
    this.dirName = `${uppercamelcase(this.getName())}`
  }

  getName() {
    return this.fullName.replace('.svg', '')
  }
}

console.log('💫 Generating icons...')

// Delete folders
const clean = new Promise((resolve) => {
  console.log('🧹 Cleaning...')
  fs.rmSync(OUTPUT_FOLDER, { recursive: true, force: true })
  resolve()
})

// Get icons
console.log(`📁 Grabbing icons from ${ICONS_PATH}...`)
glob.sync(`${ICONS_PATH}/*.svg`).forEach((iconPath) => {
  const icon = new Icon(iconPath, {})
  icons.push(icon)
})

// Create folder structure
const createFolders = (arr) =>
  new Promise((resolve) => {
    arr.map((item) =>
      fs.mkdirSync(`${OUTPUT_FOLDER}/${item.dirName}`, { recursive: true })
    )
    resolve()
  })

// Create components
const createComponents = (arr) =>
  new Promise((resolve) => {
    console.log('📜 Using template & generating export...')
    fs.writeFileSync(`${OUTPUT_FOLDER}/index.ts`, '')
    arr.forEach((item) => {
      // Create {{svg}}.tsx
      const generatedTemplate = template(item.componentName, item.fullName)
      fs.writeFileSync(
        `${OUTPUT_FOLDER}/${item.dirName}/index${generatedTemplate.extension}`,
        generatedTemplate.content
      )
      fs.appendFileSync(
        `${OUTPUT_FOLDER}/index.ts`,
        `export { default as ${item.componentName}} from './${item.dirName}'\r\n`
      )
    })
    resolve()
  })

// console.log('👠 Adding styles...')
// const copyStyles = new Promise((resolve) => {
//   fs.copyFile('util/icons/Icon.styled.ts', `${OUTPUT_FOLDER}/Icon.styled.ts`, (err) => {
//     if (err) {
//       console.log(err)
//       console.log("❌ Icon.styled.ts can't be copied")
//     }
//   })
//   resolve()
// })

Promise.all([clean, createFolders(icons), createComponents(icons)]) // copyStyles
  .then(() => {
    console.info(`✅ Created: ${icons.length} icons`)
  })
  .catch((err) => {
    if (err) {
      console.error('❌ Error')
      throw err
    }
  })
