# iTerm Colors To Warp terminal

> 🎨 This script takes an iTerm Color Profile as an argument and translates it for use with the Warp terminal.

## Prerequisites

The script depends on `YAML` libraries.

```
npm install yaml
```

## Usage

```
node iterm-colors-to-warp.js [path-to-iterm-profile.json]
```


## Steps to export an iTerm Color Profile:

1. Open the iTerm2 App
  
2. Go to Preferences -> Profiles -> Colors
  
3. Other Actions -> Save Profile as JSON
  

## Steps to use the theme in Warp terminal:

1. Run this script from the command line: 

```
node iterm-colors-to-warp.js [path-to-iterm-profile.json]
```
  
2. In Warp, create a config directory in your home directory:
  
```
mkdir -p ~/.warp/themes/
```

3. Add your new custom theme yaml theme file to this directory:
  
```
cp ./[path-to-iterm-profile.yaml] ~/.warp/themes/
```  

Your new theme should now be visible on the list of available themes.



Fork by: https://gist.github.com/2xAA/bd01638dc9ca46c590fda06c4ef0cc5a
