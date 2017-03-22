'use babel';

class TasklistStore {
    constructor(initialState = {}) {
        this.todo = (initialState.todo && initialState.todo.slice()) || [];
        this.complete = (initialState.complete && initialState.todo.slice()) || [];
        this.changeCallbacks = [];
    }

    emitChange(): void {
        const { todo, complete } = this;
        this.changeCallbacks.forEach(cb => cb({ todo, complete }));
    }

    subscribe(callback) {
        this.changeCallbacks.push(callback);
    }

    unsubscribe(callback) {
        const index = this.changeCallbacks.indexOf(callback);
        if (index >= 0) {
            this.changeCallbacks.splice(index, 1);
        }
    }

    addTodo(item) {
        console.log('add');
        this.todo.push(item);
        this.emitChange();
    }

    markComplete(index) {
        console.log('done');
        this.moveItem(this.todo, this.complete, index);
    }

    unmarkComplete(index) {
        console.log('undone');
        this.moveItem(this.complete, this.todo, index);
    }

    removeTodo(index) {
        console.log('remove undone');
        this.todo.splice(index, 1);
        this.emitChange();
    }

    removeCompleted(index) {
        console.log('remove done');
        this.complete.splice(index, 1);
        this.emitChange();
    }

    removeAllCompleted() {
        console.log('remove all');
        this.complete = [];
        this.emitChange();
    }

    moveItem(fromList, toList, fromIndex) {
        toList.push(fromList[fromIndex]);
        fromList.splice(fromIndex, 1);
        this.emitChange();
    }
}

export default TasklistStore;
