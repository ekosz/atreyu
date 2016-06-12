import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Model } from 'falcor';
import { compose, withState, withHandlers, mapProps } from 'recompose';
import { Provider, withQuery } from 'atreyu';

import Todo from './todo.jsx';
import Footer from './footer.jsx';

const App = (props) =>
  <div>
    <header className="header">
      <h1>todos</h1>
      <form onSubmit={props.handleCreate}>
        <input
          value={props.newTodo}
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          onChange={props.onChange}
        />
      </form>
    </header>
    <section className="main">
      <div>
        <input className="toggle-all" type="checkbox"/>
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {props.todos.map(todo => <Todo key={todo.id} id={todo.id} />)}
        </ul>
      </div>
    </section>
    <Footer
      filter={props.filter}
      changeFilter={props.changeFilter}
      count={props.todos.length}
    />
  </div>;

App.propTypes = {
  todos: PropTypes.array.isRequired,
  filter: PropTypes.string.isRequired,
  newTodo: PropTypes.string.isRequired,
  changeFilter: PropTypes.func.isRequired,
  handleCreate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  set: PropTypes.func.isRequired,
};

const model = new Model({
  cache: {
    todos: {
      length: 3,
      0: {
        name: 'Get milk',
        done: false,
      },
      1: {
        name: 'Drink milk',
        done: true,
      },
      2: {
        name: 'Buy more milk',
        done: false,
      },
    },
  },
});

const filters = {
  all: () => true,
  completed: todo => todo.done,
  active: todo => !todo.done,
};

const filterTodos = (filter, todosObj) => {
  const filteredTodos = [];
  for (let idx = 0; idx < todosObj.length; idx++) {
    if (todosObj[idx] && filters[filter](todosObj[idx])) {
      filteredTodos.push({ id: idx, ...todosObj[idx] });
    }
  }
  return filteredTodos;
}

const handleCreate = props => event => {
  event.preventDefault();
  props.set({ json: {
    todos: {
      length: props.data.todos.length + 1,
      [props.data.todos.length]: { name: props.newTodo, done: false },
    },
  }}).then(() => {});
  props.setNewTodo('');
};

const onChange = props => event => {
  props.setNewTodo(event.target.value);
};

const enhance = compose(
  withState('filter', 'changeFilter', 'all'),
  withState('newTodo', 'setNewTodo', ''),
  withQuery(['todos', 'length']),
  withQuery(props => [
    ['todos', 'length'],
    ['todos', { length: props.data.todos.length }, Todo.queries.todo()],
  ]),
  withHandlers({
    onChange,
    handleCreate,
  }),
  mapProps(props => ({
    ...props,
    todos: filterTodos(props.filter, props.data.todos),
  }))
);

ReactDOM.render(
  <Provider falcor={model} children={React.createElement(enhance(App))} />,
  document.querySelector('#todoapp')
);
