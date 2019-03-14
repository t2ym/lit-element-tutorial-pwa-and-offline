import { html, bind } from 'i18n-element';
import { connect } from 'pwa-helpers';
import { store } from '../redux/store.js';
import { statsSelector } from '../redux/reducer.js';
import '@vaadin/vaadin-charts';
import { BaseView } from './base-view.js';

const chartLabels = bind('chart-labels', import.meta);

html`${'chart-labels', chartLabels}
<template>
  <span id="completed">Completed</span>
  <span id="active">Active</span>
</template>
`;

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
    // get stats from the current chartConfig object if omitted
    stats = stats || (this.chartConfig ? { completed: this.chartConfig[0].y, active: this.chartConfig[1].y } : null);
    if (stats) {
      this.chartConfig = [
        { name: chartLabels.element.text.completed, y: stats.completed },
        { name: chartLabels.element.text.active, y: stats.active }
      ];    
    }
  }

  stateChanged(state) {
    const stats = statsSelector(state);
    this.updateChartConfig(stats);
    this.hasTodos = state.todos.length > 0;
  }

  render() {
    return html`${bind(this, 'stats-view')}
      <style>
        :host {
          display: block;
        }
        #chart {
          margin: 50px auto;
        }
      </style>

      ${this.getChart()}
    `;
  }

  getChart() {
    if (this.hasTodos) {
      return html`
        <vaadin-chart type="pie">
          <vaadin-chart-series .values="${this.chartConfig}">
          </vaadin-chart-series>
        </vaadin-chart>
      `;
    } else {
      return html`${'nothing-to-do', nothingToDo}
        <p>Nothing to do! 🌴</p>
      `;
    }
  }
}

customElements.define('stats-view', StatsView);
