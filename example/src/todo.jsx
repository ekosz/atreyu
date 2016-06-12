import React from 'react';

const Todo = ({ idx, name, done, set }) =>
  <li className={done ? 'completed' : ''}>
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={done}
        onClick={() => set(['todos', idx, 'done'], !done).then(() => {})}
      />
      <label>{name}</label>
      <button className="destroy"></button>
    </div>
  </li>;

Todo.queries = {
  todo: () => ['name', 'done'],
};

export default Todo;
