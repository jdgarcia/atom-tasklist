/** @babel */
/** @jsx etch.dom */

import etch from 'etch';
import TasklistStore from './tasklist-store';
let store;

export default class TasklistView {

  constructor(props = {}) {
    this.state = {
      todo: props.todo || [],
      complete: props.complete || []
    };

    store = new TasklistStore(this.state);
    store.subscribe(state => {
      this.state = state;
      etch.update(this);
    });

    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeAllCompleted = this.removeAllCompleted.bind(this);

    etch.initialize(this);
  }

  getTitle() {
    return 'Tasklist Test';
  }

  update(props = {}) {
    return etch.update(this);
  }

  writeAfterUpdate() {
    this.refs.addInput.focus();
  }

  destroy() {
    return etch.destroy(this);
  }

  getItemRow(item, index, complete = false) {
    const keyPrefix = complete ? 'complete-' : 'todo-';
    return (
      <div id={keyPrefix + index}>
        <label className={'input-label' + (complete ? ' complete' : '')}>
          <input
            type="checkbox"
            className="input-checkbox"
            checked={complete}
            onchange={e => this.onItemCheck(index, complete)}
          />
          {item}
        </label>
        <span className="icon icon-x" onclick={e => this.onItemRemove(index, complete)}></span>
      </div>
    );
  }

  onItemCheck(index, complete) {
    complete ? store.unmarkComplete(index) : store.markComplete(index);
  }

  onItemRemove(index, complete) {
    complete ? store.removeCompleted(index) : store.removeTodo(index);
  }

  onInputKeyDown(e) {
    if (e.key === 'Enter') {
      this.addItem();
    }
  }

  addItem() {
    var value = this.refs.addInput.value.trim();

    if (value) {
      store.addTodo(value);
      this.refs.addInput.value = '';
    }
  }

  removeAllCompleted() {
    store.removeAllCompleted();
  }

  render() {
    const { todo, complete } = this.state;
    return (
      <div className="tasklist">
        <input type="text" className="input-text inline-block" ref="addInput" onkeydown={this.onInputKeyDown} />
        <button className="btn" onclick={this.addItem}>Add</button>
        <div>To Do</div>
        {todo.map((item, i) => this.getItemRow(item, i))}
        <div>Complete</div>
        {complete.map((item, i) => this.getItemRow(item, i, true))}
        {complete.length ? <div onclick={this.removeAllCompleted}>Remove All</div> : null}
      </div>
    );
  }

}
