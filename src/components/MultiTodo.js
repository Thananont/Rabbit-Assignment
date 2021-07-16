import React from "react";
import { makeObservable, observable, action, computed } from "mobx";
import { observer } from "mobx-react-lite";
import "./MultiTodo.css";

class ObservableTodoList {
  todos = [];
  pendingRequests = 0;

  constructor() {
    makeObservable(this, {
      todos: observable,
      pendingRequests: observable,
      completedTodosCount: computed,
      report: computed,
      sumNumber: computed,
      concatString: computed,
      concatStringOnly: computed,
      addTodo: action,
    });
  }

  get completedTodosCount() {
    return this.todos.filter((todo) => todo.completed === true).length;
  }

  get report() {
    const nextTodo = this.todos.find((todo) => todo.completed === false);
    if (this.todos.length === 0 || nextTodo == null)
      return "You have nothing to do!";
    return (
      `Next task: ${nextTodo.task}. ` +
      `Completed: ${this.completedTodosCount}/${this.todos.length} tasks`
    );
  }

  get sumNumber() {
    var output = 0;
    var notEmpty = true;
    for (let i = 0; i < this.todos.length; i++) {
      if (/^\d+$/.test(this.todos[i].task)) {
        notEmpty = false;
        output = output + parseInt(this.todos[i].task);
      }
    }
    return output === 0 && notEmpty
      ? "Currently, there are no number tasks"
      : output;
  }

  get concatString() {
    var output = "";
    for (let i = 0; i < this.todos.length; i++) {
      output = output.concat(this.todos[i].task);
    }
    return output === "" ? "Currently, there are no tasks" : output;
  }

  get concatStringOnly() {
    var output = "";
    for (let i = 0; i < this.todos.length; i++) {
      output = output.concat(this.todos[i].task);
    }
    var noNumOutput = output.replace(/[0-9]/g, "");
    return noNumOutput === "" ? "Currently, there are no tasks" : noNumOutput;
  }

  addTodo(task) {
    this.todos.push({
      task: task,
      completed: false,
    });
  }
}

const observableTodoList = new ObservableTodoList();

const TodoList = observer(({ store }) => {
  const onNewTodo = () => {
    var content = document.getElementById("myInput").value;
    content === ""
      ? alert("Please put a title of your task")
      : store.addTodo(content);
    document.getElementById("myInput").value = "";
  };

  return (
    <div className="container">
      <div id="myDIV" className="header">
        <h2>Todo List</h2>
        <input type="text" id="myInput" placeholder="Title..." />
        <div onClick={onNewTodo} className="addBtn">
          Add
        </div>
        <p>{store.report}</p>
        <br />
        <br />
      </div>
      <ul id="myUL">
        {store.todos.map((todo, idx) => (
          <TodoView todo={todo} key={idx} />
        ))}
      </ul>
      <small> (double-click a todo to edit the task)</small>
      <div className="display">
        <h3>Display of the todo state</h3>
        <p>
          <strong>Sum of the number task:</strong> {store.sumNumber}
        </p>
        <br />
        <br />
        <p>
          <strong>Concat of all the tasks:</strong> {store.concatString}
        </p>
        <br />
        <br />
        <p>
          <strong>Concat of only strings from the tasks:</strong>{" "}
          {store.concatStringOnly}
        </p>
      </div>
    </div>
  );
});

const TodoView = observer(({ todo }) => {
  const onToggleCompleted = () => {
    todo.completed = !todo.completed;
  };

  const onRename = () => {
    todo.task = prompt("Task name", todo.task) || todo.task;
  };

  const closeTask = () => {
    const index = observableTodoList.todos.indexOf(todo);
    observableTodoList.todos.splice(index, 1);
  };

  return (
    <li className={todo.completed ? "checked" : ""}>
      <p onDoubleClick={onRename}>{todo.task}</p>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={onToggleCompleted}
      />
      <span onClick={closeTask} className="close">
        x
      </span>
    </li>
  );
});

export default function MultiTodo() {
  return (
    <div>
      <TodoList store={observableTodoList} />
    </div>
  );
}
