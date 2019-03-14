
import {
  html,
  bind
} from 'i18n-element';
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button';
import '@vaadin/vaadin-checkbox';
import '@vaadin/vaadin-radio-button/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/vaadin-radio-group';
import {
  VisibilityFilters,
  getVisibleTodosSelector
} from '../redux/reducer.js';
import { connect } from 'pwa-helpers';
import { store } from '../redux/store.js';
import {
  addTodo,
  updateTodoStatus,
  updateFilter,
  clearCompleted
} from '../redux/actions.js';
import { BaseView } from './base-view.js';
const i18nAttrRepoContainer = document.createElement('template');
i18nAttrRepoContainer.innerHTML = `<i18n-attr-repo>
  <template id="custom">
    <vaadin-text-field placeholder="$"></vaadin-text-field>
  </template>
</i18n-attr-repo>`;
document.head.appendChild(i18nAttrRepoContainer.content);
class TodoView extends connect(store)(BaseView) {
  static get is() {
    return 'todo-view';
  }
  static get importMeta() {
    return import.meta;
  }
  static get properties() {
    return {
      langUpdated: { type: String },
      todos: { type: Array },
      filter: { type: String },
      task: { type: String }
    };
  }
  constructor() {
    super();
    this.addEventListener('lang-updated', this._langUpdated);
  }
  _langUpdated(event) {
    this.updateTitles();
    this.langUpdated = this.lang;
  }
  updateTitles() {
    document.querySelector('#app-title').textContent = this.text['app-title'];
    document.querySelector('#todos-link').textContent = this.text['todos-link'];
    document.querySelector('#stats-link').textContent = this.text['stats-link'];
  }
  stateChanged(state) {
    this.todos = getVisibleTodosSelector(state);
    this.filter = state.filter;
  }
  render() {
    return html([
      '<!-- localizable -->',
      '\n      <style>\n        todo-view {\n          display: block;\n          max-width: 800px;\n          margin: 0 auto;\n        }\n\n        todo-view .input-layout {\n          width: 100%;\n          display: flex;\n        }\n\n        todo-view .input-layout vaadin-text-field {\n          flex: 1;\n          margin-right: var(--spacing);\n        }\n\n        todo-view .todos-list {\n          margin-top: var(--spacing);\n        }\n\n        todo-view .visibility-filters {\n          margin-top: calc(4 * var(--spacing));\n        }\n      </style>\n      <div class="input-layout" @keyup="',
      '">\n        <vaadin-text-field placeholder="',
      '" value="',
      '" @change="',
      '"></vaadin-text-field>\n\n        <vaadin-button theme="primary" @click="',
      '">',
      '</vaadin-button>\n      </div>\n\n      <div class="todos-list">\n        ',
      '\n      </div>\n\n      <vaadin-radio-group class="visibility-filters" value="',
      '" @value-changed="',
      '">\n        ',
      '\n      </vaadin-radio-group>\n      <vaadin-button @click="',
      '">',
      '</vaadin-button>\n      <template>\n        <json-data id="filters">',
      '</json-data>\n        <span id="app-title">',
      '</span>\n        <span id="todos-link">',
      '</span>\n        <span id="stats-link">',
      '</span>\n      </template>\n    '
    ], ...bind(this, 'todo-view', (_bind, text, model, effectiveLang) => [
      _bind,
      this.shortcutListener,
      model['div_1:vaadin-text-field']['placeholder'],
      this.task || '',
      this.updateTask,
      this.addTodo,
      text['div_1:vaadin-button_1'],
      this.todos.map(todo => html`
              <div class="todo-item">
                <vaadin-checkbox
                  ?checked="${ todo.complete }"
                  @change="${ e => this.updateTodoStatus(todo, e.target.checked) }"
                >
                  ${ todo.task }
                </vaadin-checkbox>
              </div>
            `),
      this.filter,
      this.filterChanged,
      Object.values(VisibilityFilters).map(filter => html`
              <vaadin-radio-button value="${ filter }"
                >${ this.text.filters ? this.text.filters[filter] : filter }</vaadin-radio-button
              >
            `),
      this.clearCompleted,
      text['vaadin-button_4'],
      text['filters'],
      text['app-title'],
      text['todos-link'],
      text['stats-link']
    ], {
      'meta': {},
      'model': { 'div_1:vaadin-text-field': { 'placeholder': 'Task' } },
      'div_1:vaadin-button_1': ' Add Todo ',
      'vaadin-button_4': ' Clear Completed ',
      'filters': {
        'All': 'All',
        'Active': 'Active',
        'Completed': 'Completed'
      },
      'app-title': 'Todo App',
      'todos-link': 'Todos',
      'stats-link': 'Stats'
    }));
  }
  addTodo() {
    if (this.task) {
      store.dispatch(addTodo(this.task));
      this.task = '';
    }
  }
  shortcutListener(e) {
    if (e.key === 'Enter') {
      this.addTodo();
    }
  }
  updateTask(e) {
    this.task = e.target.value;
  }
  updateTodoStatus(updatedTodo, complete) {
    store.dispatch(updateTodoStatus(updatedTodo, complete));
  }
  filterChanged(e) {
    store.dispatch(updateFilter(e.detail.value));
  }
  clearCompleted() {
    store.dispatch(clearCompleted());
  }
}
customElements.define('todo-view', TodoView);
