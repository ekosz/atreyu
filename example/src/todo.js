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

const queries = {
  todo: () => ['name', 'done'],
};

const enhance = withQuery(props => ['todos', props.id, queries.todo()]);
const EnhancedTodo = enhance(Todo);

EnhancedTodo.queries = queries;

export default EnhancedTodo;
