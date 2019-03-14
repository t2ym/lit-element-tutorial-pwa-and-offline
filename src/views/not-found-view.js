import { html, bind } from 'i18n-element';
import { BaseView } from './base-view';

class NotFoundView extends BaseView {
  static get is() {
    return 'not-found-view';
  }

  static get importMeta() {
    return import.meta;
  }

  static get properties() {
    return {
      langUpdated: { type: String },
    };
  }

  notifyPath() {
    this.langUpdated = this.lang;
  }

  render() {
    return html`${bind(this, 'not-found-view')}
      <h1>Not found!</h1>
    `;
  }
}

customElements.define('not-found-view', NotFoundView);
