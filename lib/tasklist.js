'use babel';

import { CompositeDisposable, View } from 'atom';
import TasklistView from './tasklist-view';

const TASKLIST_URI = 'atom://tasklist';

export default {

  subscriptions: null,
  taskListView: null,
  initialTaskListViewState: null,

  activate(state = {}) {
    this.initialTaskListViewState = state.taskListViewState;

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'tasklist:toggle': () => this.toggle()
    }));

    this.subscriptions.add(atom.workspace.addOpener((uri) => {
      if (uri === TASKLIST_URI) {
        this.taskListView = new TasklistView(this.initialTaskListViewState);
        return this.taskListView;
      }
    }));

    this.subscriptions.add(atom.workspace.onWillDestroyPaneItem(({ item }) => {
      if (item === this.taskListView) {
        this.taskListView.destroy();
        this.taskListView = null;
      }
    }));

    this.subscriptions.add(atom.workspace.onWillDestroyPane(({ pane }) => {
      if (pane.getItems().some(item => item === this.taskListView)) {
        this.taskListView.destroy();
        this.taskListView = null;
      }
    }));
  },

  deactivate() {
    this.subscriptions.dispose();

    if (this.taskListView) {
      this.taskListView.destroy();
      this.taskListView = null;
    }
  },

  serialize() {
    return {
      taskListViewState: this.taskListView ? this.taskListView.state : this.initialTaskListViewState
    };
  },

  toggle() {
    console.log('Tasklist was toggled!');

    if (this.taskListView) {
      var pane = atom.workspace.paneForItem(this.taskListView);
      pane.activateItem(this.taskListView);
    } else {
      atom.workspace.open(TASKLIST_URI, { split: 'right' });
    }
  }

};
