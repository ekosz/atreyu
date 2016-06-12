import React, { PropTypes } from 'react';

const Todo = ({ idx, name, done, set }) =>
  <li className={done ? 'completed' : ''}>
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={done}
        onChange={() => set({ path: ['todos', idx, 'done'], value: !done }).then(() => {})}
      />
      <label>{name}</label>
      <button className="destroy"></button>
    </div>
  </li>;

Todo.propTypes = {
  idx: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  done: PropTypes.bool.isRequired,
  set: PropTypes.func.isRequired,
};

Todo.queries = {
  todo: () => ['name', 'done'],
};

export default Todo;
