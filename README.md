# Figma Remove.bg Plugin

Remove background of images with just 1-click (Using https://www.remove.bg/).

![Preview](https://aaroniker.me/removebg.gif)

## Usage

First clone this repository
```shell
git clone https://github.com/aaroniker/figma-remove-bg.git
cd figma-remove-bg
```

Then compile .ts files (you need [TypeScript](https://www.typescriptlang.org/) installed)
```shell
tsc --build
# Or watch: tsc --watch
```

After that open a project in Figma Desktop, select _Plugins -> Development -> New Plugin_. Click `Choose a manifest.json` and find the `manifest.json` file in this plugin directory.

Done! Now _Plugins -> Development -> Remove BG -> Run/Set API Key_

## ToDo

- [ ] Show statistics about available/used credits
- [ ] More options, e.x. size
- [ ] Support selecting multiple nodes
