# H5P Drag Question Papi Jo

H5P Drag Question Papi Jo is a runtime library for creating drag-and-drop
questions in H5P. It is a fork of the official H5P Drag Question library and is
actively used for development and testing.

Tutorials and examples are available on the
[Papi Jo H5P test site](https://www.rezeau.org/wp-h5p/).

## Differences from the official library

The fork retains the standard draggable/drop-zone interaction and adds options
that include:

- quantity- and value-based drop-zone scoring;
- keeping correct answers between attempts;
- disabling completed drop zones;
- resetting occupants of single-item drop zones;
- randomized draggable positions;
- configurable score display and score explanations;
- configurable background opacity and fullscreen presentation;
- audio draggable support and additional theme styling.

The exact authoring contract is defined by `semantics.json`. Runtime H5P
dependencies and the library version are defined by `library.json`.

## Development environment

- Node.js 22 LTS
- npm 10 or newer; npm 11.18.0 is recorded as the reference package manager

With `nvm`, select the supported Node release with:

```bash
nvm use
```

Install exactly the dependency versions recorded in `package-lock.json`:

```bash
npm ci
```

Use `npm install` only when intentionally updating dependencies or the lockfile.

## npm commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Create an unminified development bundle with an inline source map. |
| `npm run build` | Create the minimized production runtime bundle. |
| `npm run watch` | Rebuild the development bundle when source files change. |
| `npm run lint` | Check runtime, tests, presave, webpack, and ESLint JavaScript. |
| `npm run lint:fix` | Apply ESLint's safe automatic fixes. |
| `npm run clean` | Remove the generated runtime bundle. |
| `npm test` | Run the Vitest unit-test suite once. |
| `npm run test:watch` | Run Vitest in interactive watch mode. |
| `npm run check` | Run lint, unit tests, and a production build. |

The generated `h5p-drag-question-papijo.js` file is intentionally ignored by
Git, but it must exist in an installed or packaged H5P library.

## Building

```bash
npm ci
npm run check
```

Webpack reads `src/drag-question-papijo.js`, transpiles the source with Babel,
and writes `h5p-drag-question-papijo.js` to the repository root. The bundle
name is derived from the npm package name and must continue to match the
`preloadedJs` entry in `library.json`.

## Unit tests

The Vitest suite covers deterministic helpers in `src/drag-utils.js`, the
classic-script score calculation in `presave.js`, and narrowly scoped
characterization tests for `src/dropzone.js`.

`drag-utils` tests use jsdom because HTML stripping relies on the browser DOM.
Presave tests run in Node.js and evaluate the unchanged classic script in a
controlled `vm` context with small H5P editor mocks. Drop-zone tests use
explicit H5P and jQuery-like fakes without simulating pointer input, jQuery UI,
or real browser layout. Draggable tests use jsdom only for element creation and
native event registration, together with explicit H5P component, event, and
jQuery-like fakes. Main-class tests bypass the constructor and invoke isolated
prototype methods against controlled object fixtures. The suites do not require
a running H5P host or network access.

## Packaging

This repository is an H5P **library directory**, not a complete `.h5p` content
package.

1. Run `npm ci` and `npm run check`.
2. Confirm that `h5p-drag-question-papijo.js` exists.
3. Include the runtime bundle, `library.json`, `semantics.json`, `presave.js`,
   icons, CSS, and language files.
4. Exclude development files listed in `.h5pignore`.
5. Copy the resulting `H5P.DragQuestionPapiJo-1.14` directory into the H5P
   platform's library area for local development, or include it through the
   platform's normal H5P export/install process.

Do not rename a standalone library archive to `.h5p`: a complete H5P content
package also requires content-level metadata and content data.

## Release procedure

1. Start from a clean working tree.
2. Update the H5P version in `library.json`.
3. Keep the npm package version aligned with the intended release version.
4. Run `npm ci`.
5. Run `npm audit` and review all build-time advisories.
6. Run `npm run clean` followed by `npm run check`.
7. Smoke-test the library in a supported H5P host, including mouse and keyboard
   interaction, retry, solution display, state restoration, and fullscreen if
   enabled.
8. Inspect the package contents against `.h5pignore`.
9. Commit the source, metadata, lockfile, documentation, and tooling changes.
10. Create the release tag and release artifact only after host validation.

## Compatibility notes

- Development is supported on Node.js 22 LTS.
- The generated browser runtime remains governed by the `browserslist` setting
  in `package.json`; the Node.js requirement does not change browser support.
- H5P core and runtime/editor library compatibility is declared in
  `library.json`.
- Runtime JavaScript expects the globals and libraries supplied by an H5P host,
  including `H5P.Question`, `H5P.Components`, `H5P.JoubelUI`, and jQuery UI.
- The development build can be run on Windows, macOS, or Linux.

## Project structure

```text
.
|-- .github/workflows/ci.yml      GitHub Actions lint/build workflow
|-- css/dragquestion.css          Runtime styles
|-- language/                     H5P authoring translations
|-- src/
|   |-- drag-question-papijo.js   Main H5P.Question implementation
|   |-- drag-utils.js             Shared drag/color/position helpers
|   |-- draggable.js              Draggable model and DOM behavior
|   `-- dropzone.js               Drop-zone model, alignment, and scoring
|-- tests/
|   |-- drag-question-papijo.test.js
|   |                               Isolated main-class characterizations
|   |-- drag-utils.test.js        Deterministic utility tests
|   |-- draggable.test.js         Draggable characterization tests
|   |-- dropzone.test.js          Drop-zone characterization tests
|   `-- presave.test.js           Classic presave-script harness and tests
|-- .babelrc                      Browser transpilation configuration
|-- eslint.config.mjs             ESLint flat configuration
|-- library.json                  H5P library metadata and dependencies
|-- semantics.json                H5P authoring schema
|-- presave.js                    Editor-side maximum-score calculation
|-- webpack.config.js             Bundle configuration
|-- package.json                  Development commands and dependencies
`-- h5p-drag-question-papijo.js   Generated runtime bundle (not tracked)
```

## License

The MIT License

Copyright (c) 2012-2014 Joubel AS

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
