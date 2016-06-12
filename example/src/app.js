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
    // `this.props.data` is injected by `withQuery`. It provides the results of
    // our Falcor query
    const todos = this.props.data.todos;

    // `this.props.set` is injected by `withQuery`. It can be used to set paths
    // in Falcor. Because set returns a Promise we must chain an empty
    // function to trigger it.
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

  // These types of getters can be usefull to transform objects returned by
  // Falcor to arrays that can be iterated over in our `render` functions
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

// For this example our falcor Model is 100% local using Falcor's cache. In
// production this would point to a Falcor router running on some server.
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

// Without using a `compose` function from something like `redux` or
// `recompose` we can construct our own like this. This will preform two
// queries. The first will get the todo's length, then the second one will use
// the result of the first query to grab the content of that many todos.
const enhance = (Comp) => (
  withQuery(['todos', 'length'])(
    withQuery(props => [
      ['todos', 'length'],
      ['todos', { length: props.data.todos.length }, Todo.queries.todo()],
    ])(Comp)
  )
);

// We must put our `Provider` component at the top of the tree so that our
// `withQuery` hocs have access to the falcor model.
ReactDOM.render(
  <Provider falcor={model} children={React.createElement(enhance(App))} />,
  document.querySelector('#todoapp')
);
