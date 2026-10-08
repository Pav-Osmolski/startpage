# Startpage – Accessible & Customisable Multi-Theme Browser Homepage

![GitHub last commit](https://img.shields.io/github/last-commit/Pav-Osmolski/startpage)
![GitHub repo size](https://img.shields.io/github/repo-size/Pav-Osmolski/startpage)
![GitHub License](https://img.shields.io/github/license/Pav-Osmolski/startpage)
![Accessibility](https://img.shields.io/badge/accessibility-WCAG%20friendly-green)
![HTML](https://img.shields.io/badge/HTML-semantic-orange)
![SCSS](https://img.shields.io/badge/SCSS-modular-pink)
![JavaScript](https://img.shields.io/badge/JavaScript-lightweight-yellow)

[Live Preview](https://pav-osmolski.github.io/startpage/)

A fast, lightweight multi-theme browser start page designed for quick access to frequently used links, search, and daily tools. The interface focuses on a clean layout, minimal distractions, and strong usability.

The project is built with semantic HTML, modular SCSS, and small JavaScript components, with attention given to accessibility, keyboard navigation, and performance.

This project is a fork of the excellent [kencx/startpage](https://github.com/kencx/startpage). It builds on the original concept with design changes, accessibility improvements, and ongoing refinements.

## 📚 Table of Contents

- [📝 List of Changes](#list-of-changes)
- [🧩 Optional Add-ons](#optional-add-ons)
- [✨ Features](#features)
- [⬇️ How to Install](#how-to-install)
- [🎨 Currently Implemented Theme Classes](#currently-implemented-theme-classes)

## List of Changes

- Responsive CSS Grid layout with a compact mobile header
- Fully responsive layout
- Semantic headings, visible keyboard focus and reduced-motion support
- Support for multiple `bookmarks` containers
- Added search functionality
- Tabbed navigation for `links` containers using slick carousel
- Asynchronous JavaScript loader
- Optional JavaScript loads based on element classes in the DOM, in dependency order
- Added fade-in on page load
- Fixed HTML validation issues
- Re-organised images into their own folder
- Alternate theme styles are included in `assets/scss/style.scss` under `/* Themes */` with examples shown below
- Edit `index.html` to change the `<html>` element class for an alternative theme, or be creative and add your own
- Image is set via the `--image` variable
- Fonts: Ubuntu and Bebas Neue
- Colour scheme: ELDEN RING, mostly dictated by the `--hue-rotate` variable
- ELDEN RING gif: [Here](https://pinargokoglu.tumblr.com/post/675069910947364864/elden-ring)

## Optional Add-ons
These add-ons will only load when required, based on whether the relevant element class is detected in the DOM. You can configure the JavaScript add-on list within `async-loader.js`.
- [accessible slick carousel](https://github.com/Accessible360/accessible-slick) `<div class="links slick-start">`
- [jQuery Ripples](https://github.com/sirxemic/jquery.ripples) `<body class="fade-in ripples">`
- Date/Time `<p id="Date"><time>Welcome back</time></p>`; updates once per second and pauses in hidden tabs
- Animating stars `<body class="fade-in stars">`
- Search `<body class="fade-in search">`
- [jQuery](https://jquery.com/download/) loads automatically when a carousel or water effect needs it; the legacy `jquery` class is optional

The loader skips stars and water effects when the browser requests reduced motion. Animated image files can still animate; choose a static image for a fully still theme. If JavaScript or a carousel plugin fails, all bookmark lists remain available.

## Features

Search functionality `<body class="fade-in search">`. The default is set to Google. You can change the search engine by modifying `action="https://www.google.com/search"`

![search functionality](screenshots/pav-startpage-search.png)

Tabbed containers `<div class="links slick-start slick-single-arrow">`

![tabbed navigation](screenshots/pav-startpage-navigation.png)

Privacy blur/unblur on hover `<ul class="blur">`

![privacy blur](screenshots/pav-startpage-privacy.png)

## How to Install

1. Clone this repo to a location on your hard disk, e.g. `C:/StartPages/`.
2. Open `index.html` or set your browser homepage to `file:///C:/StartPages/startpage/index.html`. The compiled assets are included; no installation is needed just to use it.
3. To customise the source, install Node.js 22 or newer and run `npm ci` in the repository directory.
4. Edit `index.html` for bookmarks and theme classes, `assets/scss/` for styles, and the unminified files in `assets/js/` for behaviour.
5. Run `npm run build` and include the updated `dist/` files with your changes. The build works on Windows, macOS and Linux.

### Development commands

| Command | Purpose |
| --- | --- |
| `npm run build` | Compile expanded and compressed CSS with relative source maps, and minify the project's JavaScript |
| `npm run build:scss` | Rebuild both CSS variants |
| `npm run build:js` | Rebuild JavaScript |
| `npm run watch` | Rebuild CSS and JavaScript when either source directory changes |
| `npm start` | Preview at `http://127.0.0.1:4173` |
| `npm test` | Check plugin loading, failure handling, reduced motion, textarea search and clock behaviour |

Run the watcher and preview in separate terminals. There is no automatic browser reload. Styles in `dist/` are generated from SCSS; the older `assets/css/` files are retained only for compatibility and are not used by `index.html`. The lockfile fixes the build dependency versions. CI runs the build and tests on Windows and Linux, and checks that generated assets are up to date.

For the optional textarea search, replace the input with the commented textarea, change the label's `for` attribute to `search-textarea`, and add `textarea` to the body classes. Keep only one enabled field named `q`. Enter submits, Shift+Enter adds a line, and IME composition is preserved.

## Currently Implemented Theme Classes

ELDEN RING Press Start `<html lang="en" class="default eldenring-start">`

![startpage elden ring](screenshots/startpage-eldenring.jpg)

ELDEN RING Lady Ranni `<html lang="en" class="default eldenring-ranni">` and if you're feeling adventurous `<body class="fade-in ripples">`

![startpage ranni the witch](screenshots/startpage-ranni.jpg)

ELDEN RING Pot Boy `<html lang="en" class="default eldenring-potboy">`

![startpage potboy](screenshots/startpage-potboy.jpg)

ELDEN RING Ranni's Dark Moon `<html lang="en" class="default eldenring-ranni-dark-moon">` and for some extra magic `<body class="fade-in stars">`

![startpage potboy](screenshots/startpage-ranni-dark-moon.jpg)

Vapor by [nwvh](https://github.com/nwvh/startpage) `<html lang="en" class="default vapor">`

![startpage vapor](screenshots/startpage-vapor.jpg)

Please feel free to fork and make your own changes!
