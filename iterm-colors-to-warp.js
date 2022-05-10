const fs = require('fs')
const YAML = require('yaml')

const mapping = {
  'background': 'Background Color',
  'accent': 'Selection Color',
  'foreground': 'Foreground Color',
  'details': 'Background Color',
  'normal.black': 'Ansi 0 Color',
  'normal.blue': 'Ansi 4 Color',
  'normal.cyan': 'Ansi 6 Color',
  'normal.green': 'Ansi 2 Color',
  'normal.magenta': 'Ansi 5 Color',
  'normal.red': 'Ansi 1 Color',
  'normal.white': 'Ansi 7 Color',
  'normal.yellow': 'Ansi 3 Color',
  'bright.black': 'Ansi 8 Color',
  'bright.blue': 'Ansi 12 Color',
  'bright.cyan': 'Ansi 14 Color',
  'bright.green': 'Ansi 10 Color',
  'bright.magenta': 'Ansi 13 Color',
  'bright.red': 'Ansi 9 Color',
  'bright.white': 'Ansi 15 Color',
  'bright.yellow': 'Ansi 11 Color'
}

const componentToHex = c => {
  const hex = c.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}

const formatToWarpJson = (convertedValues) => {
  let targetJson = {
   'terminal_colors': {'normal': {}, 'bright': {}},
  }
  Object.keys(convertedValues).forEach((warpKey) => {
   const warpValue = convertedValues[warpKey]
   let tempColor = {}
   const subWarpKey = warpKey.substring(warpKey.indexOf('.') + 1)
   tempColor[subWarpKey] = warpValue
   if(warpKey.startsWith('bright')) {
     let brightColor = targetJson['terminal_colors']['bright']
     brightColor = Object.assign(brightColor, tempColor)
     delete convertedValues[warpKey]
   } else if(warpKey.startsWith('normal')) {
     let normalColor = targetJson['terminal_colors']['normal']
     normalColor = Object.assign(normalColor, tempColor)
     delete convertedValues[warpKey]
   }
 })
 const warpJson = Object.assign(convertedValues, targetJson)
 return warpJson
}

const checkDarkness = (values) => {
  const redComponent = Math.round(values['Red Component'] * 255)
  const greenComponent = Math.round(values['Green Component'] * 255)
  const blueComponent = Math.round(values['Blue Component'] * 255)
  const darknessNum = 1 - (0.299 * redComponent + 0.587 * greenComponent + 0.114 * blueComponent) / 255
  const darkness = darknessNum > 0.5 ? 'darker' : 'lighter'
  return darkness
}

if(process.argv.length === 3) {
  try {
    const fileName = process.argv[2]
    const rawData = fs.readFileSync(fileName)
    const jsonData = JSON.parse(rawData)

    let convertedValues = Object.keys(mapping).reduce((results, warpKey) => {
      const itermKey = mapping[warpKey]
      const values = jsonData[itermKey]
      const red = componentToHex(Math.round(values['Red Component'] * 255))
      const green = componentToHex(Math.round(values['Green Component'] * 255))
      const blue = componentToHex(Math.round(values['Blue Component'] * 255))
      let warpValue = `#${red}${green}${blue}`

      // Check if a color is more dark than light
      if(warpKey === 'details') {
        warpValue = checkDarkness(values)
      }

      results[warpKey] = warpValue
      return results
    }, {})

    // Convert JSON to  Warp JSON
    const warpJson = formatToWarpJson(convertedValues)

    // Convert JSON to YAML 
    const doc = new YAML.Document()
    doc.contents = warpJson

    // Save  files 
    const finallyName = fileName.replace(/\.[^/.]+$/, "")
    fs.writeFile(`${finallyName}.yml`, doc, "utf8", (error) => {
      if(error) {
        console.log(error)
      } else {
        console.log("Write complete")
      }
    })
  } catch(error) {
    console.log(error)
  }
} else {
  console.log('Please pass a json file as an argument.')
  console.log('usage: `node iterm-colors-to-warp.js [path-to-iterm-profile.json]`')
}

