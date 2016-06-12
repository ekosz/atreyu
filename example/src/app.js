import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Model } from 'falcor';
import { Provider, withQuery } from 'atreyu';

import Todo from './todo';
import Footer from './footer';

const filters = {
  all: () => true,
  completed: todo => todo.done,
  active: todo => !todo.done,
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newText: '',
      filter: 'all',
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    const todos = this.props.data.todos;

    this.props.set({ json: {
      todos: {
        length: todos.length + 1,
        [todos.length]: { name: this.state.newText, done: false },
      },
    }}).then(() => {});
    this.setState({ newText: '' });
  };

  handleChange = event => {
    this.setState({ newText: event.target.value });
  };

  handleChangeFilter = filter => {
    this.setState({ filter });
  }

  get filteredTodos() {
    const filter = this.state.filter;
    const todosObj = this.props.data.todos;

    const todos = [];
    for (let idx = 0; idx < todosObj.length; idx++) {
      if (todosObj[idx] && filters[filter](todosObj[idx])) {
        todos.push({ id: idx, ...todosObj[idx] });
      }
    }
    return todos;
  }

  render() {
    return (
      <div>
        <header className="header">
          <h1>todos</h1>
          <form onSubmit={this.handleSubmit}>
            <input
              value={this.state.newText}
              className="new-todo"
              placeholder="What needs to be done?"
              autoFocus
              onChange={this.handleChange}
            />
          </form>
        </header>
        <section className="main">
          <div>
            <input className="toggle-all" type="checkbox"/>
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
              {this.filteredTodos.map(todo => <Todo key={todo.id} id={todo.id} />)}
            </ul>
          </div>
        </section>
        <Footer
          filter={this.state.filter}
          changeFilter={this.handleChangeFilter}
          count={this.filteredTodos.length}
        />
      </div>
    );
  }
}

App.propTypes = {
  data: PropTypes.shape({
    todos: PropTypes.object.isRequired,
  }).isRequired,
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

const enhance = (Comp) => (
  withQuery(['todos', 'length'])(
    withQuery(props => [
      ['todos', 'length'],
      ['todos', { length: props.data.todos.length }, Todo.queries.todo()],
    ])(Comp)
  )
);

ReactDOM.render(
  <Provider falcor={model} children={React.createElement(enhance(App))} />,
  document.querySelector('#todoapp')
);
