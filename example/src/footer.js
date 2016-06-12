import React, { PropTypes } from 'react';

const filterProps = (type, filter, changeFilter) => ({
  className: filter === type ? 'selected' : '',
  onClick: () => changeFilter(type),
});

const Footer = ({ filter, changeFilter, count }) =>
  <footer className="footer">
    <span className="todo-count"><strong>{count}</strong> item left</span>
    <ul className="filters">
      <li>
        <a {...filterProps('all', filter, changeFilter)}>All</a>
      </li>
      <li>
        <a {...filterProps('active', filter, changeFilter)}>Active</a>
      </li>
      <li>
        <a {...filterProps('completed', filter, changeFilter)}>Completed</a>
      </li>
    </ul>

    <button className="clear-completed">Clear completed</button>
  </footer>;

Footer.propTypes = {
  filter: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  changeFilter: PropTypes.func.isRequired,
};

export default Footer;
