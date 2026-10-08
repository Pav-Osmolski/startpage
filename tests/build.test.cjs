const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');

test('asset versions are stable and track CSS, dependent JavaScript and vendor changes', () => {
  const repository = path.resolve(__dirname, '..');
  const temporaryRoot = fs.realpathSync(os.tmpdir());
  const fixture = fs.mkdtempSync(path.join(temporaryRoot, 'startpage-versions-'));
  try {
    for (const name of ['scripts', 'assets/scss', 'assets/js']) fs.mkdirSync(path.join(fixture, name), { recursive: true });
    fs.copyFileSync(path.join(repository, 'scripts/build.cjs'), path.join(fixture, 'scripts/build.cjs'));
    fs.writeFileSync(path.join(fixture, 'index.html'), '<link href="dist/css/compiled.min.css"><script src="dist/js/async-loader.min.js"></script>');
    fs.writeFileSync(path.join(fixture, 'assets/scss/main.scss'), 'body { color: red; }');
    fs.writeFileSync(path.join(fixture, 'assets/js/async-loader.js'), 'console.log("loader");');
    fs.writeFileSync(path.join(fixture, 'assets/js/datetime.js'), 'console.log("clock one");');
    fs.writeFileSync(path.join(fixture, 'assets/js/vendor.min.js'), 'console.log("vendor one");\r\n');
    const build = (target = '') => {
      const result = spawnSync(process.execPath, [path.join(fixture, 'scripts/build.cjs'), target], {
        cwd: temporaryRoot, encoding: 'utf8', env: { ...process.env, NODE_PATH: path.join(repository, 'node_modules') }
      });
      assert.equal(result.status, 0, result.stderr);
      const html = fs.readFileSync(path.join(fixture, 'index.html'), 'utf8');
      assert.equal((html.match(/\?v=/g) || []).length, 2);
      return { css: html.match(/compiled\.min\.css\?v=([a-f0-9]{12})/)[1], js: html.match(/async-loader\.min\.js\?v=([a-f0-9]{12})/)[1] };
    };
    const first = build();
    assert.deepEqual(build(), first, 'Identical builds must retain their versions');
    fs.writeFileSync(path.join(fixture, 'assets/js/vendor.min.js'), 'console.log("vendor one");\n');
    assert.deepEqual(build(), first, 'Checkout line endings must not affect versions');
    fs.writeFileSync(path.join(fixture, 'assets/scss/main.scss'), 'body { color: blue; }');
    const cssChange = build('css');
    assert.notEqual(cssChange.css, first.css);
    assert.equal(cssChange.js, first.js);
    fs.writeFileSync(path.join(fixture, 'assets/js/datetime.js'), 'console.log("clock two");');
    const jsChange = build('js');
    assert.equal(jsChange.css, cssChange.css);
    assert.notEqual(jsChange.js, cssChange.js, 'Changing a dependent script must invalidate the loader URL');
    fs.writeFileSync(path.join(fixture, 'assets/js/vendor.min.js'), 'console.log("vendor two");');
    assert.notEqual(build().js, jsChange.js);
  } finally {
    const relative = path.relative(temporaryRoot, fixture);
    assert.ok(!relative.startsWith('..') && !path.isAbsolute(relative) && relative.startsWith('startpage-versions-'));
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
