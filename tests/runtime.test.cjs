const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = name => fs.readFileSync(path.join(__dirname, '../assets/js', name), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));

function loader({ selectors = [], reduced = false, date = true, version = null } = {}) {
  const scripts = [];
  const warnings = [];
  vm.runInNewContext(source('async-loader.js'), {
    window: { matchMedia: () => ({ matches: reduced }) },
    URL,
    document: {
      currentScript: version ? { src: `https://example.test/dist/js/async-loader.min.js?v=${version}` } : null,
      getElementById: () => date,
      querySelector: selector => selectors.includes(selector),
      createElement: () => ({}),
      body: { appendChild: script => scripts.push(script) }
    },
    console: { warn: message => warnings.push(message) }
  });
  return { scripts, warnings };
}

test('carousel configuration waits for both jQuery and the plugin to finish', async () => {
  const { scripts } = loader({ selectors: ['.slick-start'] });
  assert.deepEqual(scripts.map(script => script.src), ['dist/js/datetime.min.js', 'assets/js/jquery.min.js']);
  scripts[1].onload();
  await flush();
  assert.equal(scripts.at(-1).src, 'assets/js/slick.min.js');
  assert.equal(scripts.length, 3);
  scripts[2].onload();
  await flush();
  assert.equal(scripts.at(-1).src, 'dist/js/slick-config.min.js');
});

test('plugin failure does not load its configuration or break the clock', async () => {
  const { scripts, warnings } = loader({ selectors: ['.slick-start'] });
  scripts[1].onload();
  await flush();
  scripts[2].onerror();
  await flush();
  assert.equal(scripts.length, 3);
  assert.match(warnings[0], /slick.min.js/);
  assert.equal(scripts[0].src, 'dist/js/datetime.min.js');
});

test('reduced motion skips canvas and water effects while keeping navigation', async () => {
  const { scripts } = loader({ selectors: ['.stars', '.ripples', '.slick-start'], reduced: true });
  scripts[1].onload();
  await flush();
  assert.deepEqual(scripts.map(script => script.src), [
    'dist/js/datetime.min.js', 'assets/js/jquery.min.js', 'assets/js/slick.min.js'
  ]);
});

test('plain textarea search loads without jQuery', () => {
  const { scripts } = loader({ selectors: ['.textarea'], date: false });
  assert.deepEqual(scripts.map(script => script.src), ['dist/js/search.min.js']);
});

test('the loader versions every dependency, including plugins and configuration', async () => {
  const { scripts } = loader({ selectors: ['.slick-start'], version: 'release123' });
  assert.equal(scripts[0].src, 'dist/js/datetime.min.js?v=release123');
  assert.equal(scripts[1].src, 'assets/js/jquery.min.js?v=release123');
  scripts[1].onload();
  await flush();
  assert.equal(scripts[2].src, 'assets/js/slick.min.js?v=release123');
  scripts[2].onload();
  await flush();
  assert.equal(scripts[3].src, 'dist/js/slick-config.min.js?v=release123');
});

test('textarea Enter submits; Shift+Enter and IME composition remain available', () => {
  let listener;
  let submissions = 0;
  let prevented = 0;
  vm.runInNewContext(source('search.js'), {
    document: { getElementById: () => ({
      addEventListener: (type, callback) => { listener = callback; },
      form: { requestSubmit: () => { submissions++; } }
    }) }
  });
  for (const options of [{}, { shiftKey: true }, { isComposing: true }]) {
    listener({ key: 'Enter', preventDefault: () => { prevented++; }, ...options });
  }
  assert.equal(submissions, 1);
  assert.equal(prevented, 1);
});

test('clock renders immediately, pauses when hidden and refreshes on return', () => {
  const time = { setAttribute: () => {} };
  let listener;
  const intervals = [];
  const cleared = [];
  const document = {
    hidden: false,
    getElementById: () => ({ querySelector: () => time }),
    addEventListener: (type, callback) => { listener = callback; }
  };
  vm.runInNewContext(source('datetime.js'), {
    document,
    setInterval: (callback, delay) => { intervals.push(delay); return intervals.length; },
    clearInterval: id => cleared.push(id)
  });
  assert.match(time.textContent, /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
  assert.deepEqual(intervals, [1000]);
  document.hidden = true;
  listener();
  assert.equal(cleared.at(-1), 1);
  assert.equal(intervals.length, 1);
  document.hidden = false;
  listener();
  assert.equal(intervals.length, 2);
});
