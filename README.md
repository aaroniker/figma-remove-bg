# Figma Remove.bg Plugin

Remove background of images with just 1-click (Using https://www.remove.bg/).

![Preview](https://aaroniker.me/removebg.gif)

## Usage

Download it on the Figma plugin library [figma.com/c/plugin/738992712906748191/Remove-BG](https://www.figma.com/c/plugin/738992712906748191/Remove-BG)

## Development

First clone this repository
```shell
git clone https://github.com/aaroniker/figma-remove-bg.git
cd figma-remove-bg
```

Install dependencies & build files
```shell
npm install
npm run build
# Or watch: npm run dev
```

After that open a project in Figma Desktop, select _Plugins -> Development -> New Plugin_. Click `Choose a manifest.json` and find the `manifest.json` file in this plugin directory.

Done! Now _Plugins -> Development -> Remove BG -> Run/Set API Key_

## ToDo

- [ ] Show statistics about available/used credits
- [ ] More options, e.x. size
- [ ] Support selecting multiple nodes

## Author

- Aaron Iker ([Twitter](https://twitter.com/aaroniker_me))
