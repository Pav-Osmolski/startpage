const fs = require('node:fs');
const path = require('node:path');
const { fileURLToPath } = require('node:url');
const sass = require('sass');
const uglify = require('uglify-js');

const root = path.resolve(__dirname, '..');
const target = process.argv.find(arg => arg === 'css' || arg === 'js');

function build() {
  // Compile everything before replacing working assets if a source contains errors.
  const output = new Map();
  if (target !== 'js') {
    for (const [name, style] of [['compiled.css', 'expanded'], ['compiled.min.css', 'compressed']]) {
      const result = sass.compile(path.join(root, 'assets/scss/main.scss'), { style, sourceMap: true });
      const map = result.sourceMap;
      map.sources = map.sources.map(source => path.relative(path.join(root, 'dist/css'), fileURLToPath(source)).split(path.sep).join('/'));
      output.set(`dist/css/${name}`, `${result.css}\n/*# sourceMappingURL=${name}.map */\n`);
      output.set(`dist/css/${name}.map`, JSON.stringify(map));
    }
  }
  if (target !== 'css') {
    for (const name of fs.readdirSync(path.join(root, 'assets/js')).sort()) {
      if (!name.endsWith('.js') || name.endsWith('.min.js')) continue;
      const result = uglify.minify(fs.readFileSync(path.join(root, 'assets/js', name), 'utf8'));
      if (result.error) throw result.error;
      output.set(`dist/js/${name.replace(/\.js$/, '.min.js')}`, `${result.code}\n`);
    }
  }
  for (const [name, content] of output) {
    const destination = path.join(root, name);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content);
  }
  console.log(`Built ${output.size} assets.`);
}

build();
if (process.argv.includes('--watch')) {
  let timer;
  for (const directory of ['assets/scss', 'assets/js']) {
    fs.watch(path.join(root, directory), () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try { build(); } catch (error) { console.error(error.message); }
      }, 100);
    });
  }
  console.log('Watching SCSS and JavaScript. Press Ctrl+C to stop.');
}
