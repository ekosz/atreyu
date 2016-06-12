import React from 'react';


function selectedClass(left, right) {
  return left === right ? 'selected' : '';
}

const Footer = ({ filter, changeFilter, count }) =>
  <footer className="footer">
    <span className="todo-count"><strong>{count}</strong> item left</span>
    <ul className="filters">
      <li>
        <a
          className={selectedClass('all', filter)}
          data-name="all"
          onClick={() => changeFilter('all')}
        >
          All
        </a>
      </li>
      <li>
        <a
          className={selectedClass('active', filter)}
          data-name="active"
          onClick={() => changeFilter('active')}
        >
          Active
        </a>
      </li>
      <li>
        <a
          className={selectedClass('completed', filter)}
          data-name="completed"
          onClick={() => changeFilter('completed')}
        >
          Completed
        </a>
      </li>
    </ul>

    <button className="clear-completed">Clear completed</button>
  </footer>;

export default Footer;
