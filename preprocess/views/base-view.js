import { LitElement } from 'lit-element';
import { i18n } from 'i18n-element';
export class BaseView extends i18n(LitElement) {
  createRenderRoot() {
    return this;
  }
}
