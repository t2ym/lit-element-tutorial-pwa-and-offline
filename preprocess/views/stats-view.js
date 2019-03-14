
import {
  html,
  bind
} from 'i18n-element';
import { connect } from 'pwa-helpers';
import { store } from '../redux/store.js';
import { statsSelector } from '../redux/reducer.js';
import '@vaadin/vaadin-charts';
import { BaseView } from './base-view.js';
const chartLabels = bind('chart-labels', import.meta);
html([
  '<!-- localizable -->',
  '\n<template>\n  <span id="completed">',
  '</span>\n  <span id="active">',
  '</span>\n</template>\n'
], ...bind(('chart-labels', chartLabels), (_bind, text, model, effectiveLang) => [
  _bind,
  text['completed'],
  text['active']
], {
  'meta': {},
  'model': {},
  'completed': 'Completed',
  'active': 'Active'
}));
const nothingToDo = bind('nothing-to-do', import.meta);
class StatsView extends connect(store)(BaseView) {
  static get is() {
    return 'stats-view';
  }
  static get importMeta() {
    return import.meta;
  }
  static get properties() {
    return {
      langUpdated: { type: String },
      chartConfig: { type: Object }
    };
  }
  constructor() {
    super();
    chartLabels.element.addEventListener('lang-updated', this._langUpdated.bind(this));
    this.addEventListener('lang-updated', this._langUpdated);
  }
  _langUpdated(event) {
    this.updateChartConfig();
    this.langUpdated = this.lang;
  }
  updateChartConfig(stats) {
    stats = stats || (this.chartConfig ? {
      completed: this.chartConfig[0].y,
      active: this.chartConfig[1].y
    } : null);
    if (stats) {
      this.chartConfig = [
        {
          name: chartLabels.element.text.completed,
          y: stats.completed
        },
        {
          name: chartLabels.element.text.active,
          y: stats.active
        }
      ];
    }
  }
  stateChanged(state) {
    const stats = statsSelector(state);
    this.updateChartConfig(stats);
    this.hasTodos = state.todos.length > 0;
  }
  render() {
    return html([
      '<!-- localizable -->',
      '\n      <style>\n        :host {\n          display: block;\n        }\n        #chart {\n          margin: 50px auto;\n        }\n      </style>\n\n      ',
      '\n    '
    ], ...bind(this, 'stats-view', (_bind, text, model, effectiveLang) => [
      _bind,
      this.getChart()
    ], {
      'meta': {},
      'model': {}
    }));
  }
  getChart() {
    if (this.hasTodos) {
      return html`
        <vaadin-chart type="pie">
          <vaadin-chart-series .values="${ this.chartConfig }">
          </vaadin-chart-series>
        </vaadin-chart>
      `;
    } else {
      return html([
        '<!-- localizable -->',
        '\n        <p>',
        '</p>\n      '
      ], ...bind(('nothing-to-do', nothingToDo), (_bind, text, model, effectiveLang) => [
        _bind,
        text['p']
      ], {
        'meta': {},
        'model': {},
        'p': 'Nothing to do! \uD83C\uDF34'
      }));
    }
  }
}
customElements.define('stats-view', StatsView);
