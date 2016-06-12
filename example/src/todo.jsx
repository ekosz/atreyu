import React, { PropTypes } from 'react';
import { compose, withState, mapProps, withHandlers, setStatic } from 'recompose';
import { withQuery } from 'atreyu';
import classNames from 'classNames';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

const Todo = ({
  todo,
  editing,
  editText,
  toggleDone,
  handleEdit,
  handleSubmit,
  handleChange,
  handleKeyDown,
}) =>
  <li className={classNames({ completed: todo.done, editing })}>
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={todo.done}
        onChange={toggleDone}
      />
      <label onDoubleClick={handleEdit}>{todo.name}</label>
      <button className="destroy"></button>
    </div>
    <input
      className="edit"
      value={editText}
      onBlur={handleSubmit}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  </li>;

Todo.propTypes = {
  todo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired,
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  editText: PropTypes.string.isRequired,
  toggleDone: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
};

const toggleDone = props => () => {
  props.set({
    path: ['todos', props.id, 'done'],
    value: !props.todo.done,
  }).then(() => {});
};

const handleEdit = props => () => {
  props.setEditing(true);
  props.setEditText(props.todo.name);
};

const handleSubmit = props => () => {
  const value = props.editText.trim();
  if (value) {
    props.set({ path: ['todos', props.id, 'name'], value }).then(() => {});
    props.setEditing(false);
    props.setEditText(value);
  }
};

const handleChange = props => event => {
  if (props.editing) props.setEditText(event.target.value);
};

const handleKeyDown = props => event => {
  if (event.which === ESCAPE_KEY) {
    props.setEditText(props.todo.name);
    props.setEditing(false);
  } else if (event.which === ENTER_KEY) {
    props.handleSubmit(event);
  }
};

const queries = {
  todo: () => ['name', 'done'],
};

export default compose(
  setStatic('queries', queries),
  withQuery(props => ['todos', props.id, queries.todo()]),
  mapProps(props => ({
    ...props,
    todo: props.data.todos[props.id],
  })),
  withState('editing', 'setEditing', false),
  withState('editText', 'setEditText', ''),
  withHandlers({ handleSubmit }),
  withHandlers({
    toggleDone,
    handleEdit,
    handleChange,
    handleKeyDown,
  }),
)(Todo);
