import React, { Component, PropTypes } from 'react';
import { withQuery } from 'atreyu';
import classNames from 'classNames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;
function noop() {}

class Todo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      editText: '',
    };
  }

  handleToggle = () => {
    const { id, set } = this.props;

    set({ path: ['todos', id, 'done'], value: !this.todo.done }).then(noop);
  };

  handleEdit = () => {
    this.setState({ editing: true, editText: this.todo.name });
  };

  handleSubmit = () => {
    const value = this.state.editText.trim();
    const { set, id } = this.props;

    if (value) {
      set({ path: ['todos', id, 'name'], value }).then(noop);
      this.setState({ editing: false, editText: value });
    }
  };

  handleChange = event => {
    if (this.state.editing) this.setState({ editText: event.target.value });
  };

  handleKeyDown = event => {
    if (event.which === ESCAPE_KEY) {
      this.setState({ editing: false, editText: this.todo.name });
    } else if (event.which === ENTER_KEY) {
      this.handleSubmit(event);
    }
  };

  // Create a helper method to quickly access our local todo
  get todo() {
    const { id, data } = this.props;

    return data.todos[id];
  }

  render() {
    const { editing, editText } = this.state;

    return (
      <li className={classNames({ completed: this.todo.done, editing })}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={this.todo.done}
            onChange={this.handleToggle}
          />
          <label onDoubleClick={this.handleEdit}>{this.todo.name}</label>
          <button className="destroy"></button>
        </div>
        <input
          className="edit"
          value={editText}
          onBlur={this.handleSubmit}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    );
  }
}

Todo.propTypes = {
  id: PropTypes.number.isRequired,
  data: PropTypes.shape({
    todos: PropTypes.object.isRequired,
  }).isRequired,
  set: PropTypes.func.isRequired,
};

// To be relay(esk) we can define the properties that we use inside our inner
// components. Then our outer containers can use these queries to (pre)fetch
// the data we need to render these components. These gives you the advantage
// of defining the data you need in the same place that its used.
const queries = {
  todo: () => ['name', 'done'],
};

const enhance = withQuery(props => ['todos', props.id, queries.todo()]);
const EnhancedTodo = enhance(Todo);

// Becuase we're exporting the EnhancedTodo component and not the underlining
// Todo, we must attach our static properties to it instead.
EnhancedTodo.queries = queries;

export default EnhancedTodo;
