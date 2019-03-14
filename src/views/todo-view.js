import { html, bind } from 'i18n-element';
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
    // It is not a good practice to localize items outside of the element via the default view
    // <app-view> element should be defined instead to render the title and the links
    document.querySelector('#app-title').textContent = this.text['app-title'];
    document.querySelector('#todos-link').textContent = this.text['todos-link'];
    document.querySelector('#stats-link').textContent = this.text['stats-link'];
  }

  stateChanged(state) {
    this.todos = getVisibleTodosSelector(state);
    this.filter = state.filter;
  }

  render() {
    return html`${bind(this, 'todo-view')}
      <style>
        todo-view {
          display: block;
          max-width: 800px;
          margin: 0 auto;
        }

        todo-view .input-layout {
          width: 100%;
          display: flex;
        }

        todo-view .input-layout vaadin-text-field {
          flex: 1;
          margin-right: var(--spacing);
        }

        todo-view .todos-list {
          margin-top: var(--spacing);
        }

        todo-view .visibility-filters {
          margin-top: calc(4 * var(--spacing));
        }
      </style>
      <div class="input-layout" @keyup="${this.shortcutListener}">
        <vaadin-text-field
          placeholder="Task"
          value="${this.task || ''}"
          @change="${this.updateTask}"
        ></vaadin-text-field>

        <vaadin-button theme="primary" @click="${this.addTodo}">
          Add Todo
        </vaadin-button>
      </div>

      <div class="todos-list">
        ${
          this.todos.map(
            todo => html`
              <div class="todo-item">
                <vaadin-checkbox
                  ?checked="${todo.complete}"
                  @change="${
                    e => this.updateTodoStatus(todo, e.target.checked)
                  }"
                >
                  ${todo.task}
                </vaadin-checkbox>
              </div>
            `
          )
        }
      </div>

      <vaadin-radio-group
        class="visibility-filters"
        value="${this.filter}"
        @value-changed="${this.filterChanged}"
      >
        ${
          Object.values(VisibilityFilters).map(
            filter => html`
              <vaadin-radio-button value="${filter}"
                >${this.text.filters ? this.text.filters[filter] : filter}</vaadin-radio-button
              >
            `
          )
        }
      </vaadin-radio-group>
      <vaadin-button @click="${this.clearCompleted}">
        Clear Completed
      </vaadin-button>
      <template>
        <json-data id="filters">{
          "All": "All",
          "Active": "Active",
          "Completed": "Completed"
        }</json-data>
        <span id="app-title">Todo App</span>
        <span id="todos-link">Todos</span>
        <span id="stats-link">Stats</span>
      </template>
    `;
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
