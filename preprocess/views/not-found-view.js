
import {
  html,
  bind
} from 'i18n-element';
import { BaseView } from './base-view';
class NotFoundView extends BaseView {
  static get is() {
    return 'not-found-view';
  }
  static get importMeta() {
    return import.meta;
  }
  static get properties() {
    return { langUpdated: { type: String } };
  }
  notifyPath() {
    this.langUpdated = this.lang;
  }
  render() {
    return html([
      '<!-- localizable -->',
      '\n      <h1>',
      '</h1>\n    '
    ], ...bind(this, 'not-found-view', (_bind, text, model, effectiveLang) => [
      _bind,
      text['h1']
    ], {
      'meta': {},
      'model': {},
      'h1': 'Not found!'
    }));
  }
}
customElements.define('not-found-view', NotFoundView);
