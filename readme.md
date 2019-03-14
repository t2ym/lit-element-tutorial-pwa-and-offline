# lit-html I18N webpack example app

## Notes
- `@opwn-wc/webpack-import-meta-loader` is a minimal plugin and its feasibility is being verified
- `static get is()` getter is explicitly declared to survive UglifyJS mangling for class names, whose feasiblity is being verified as well
- Dependent `@vaadin/*` elements are depending on `@polymer/polymer` and `@polymer/*` elements.
- While the polymer elements and libraries are all included in the generated bundles, the webpack configurations should be compatible even after they are removed from the app.

This app is based on https://github.com/vaadin-learning-center/lit-element-tutorial-pwa-and-offline

Tutorial: https://preview.vaadin.com/tutorials/lit-element/pwa-and-offline
Video: https://youtu.be/ToxKlmqgZHw
