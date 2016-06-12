import { Component, PropTypes, Children } from 'react';

import Dispatcher from './dispatcher';

export default class Provider extends Component {
  constructor(props, context) {
    super(props, context);
    this.falcor = props.falcor;
    this.dispatcher = new Dispatcher();
    this.falor.onChange(this.dispatcher.dispatch);
  }

  getChildContext() {
    return { falor: this.falcor, falcorDispatcher: this.dispatcher };
  }

  render() {
    return Children.only(this.props.children);
  }
}

Provider.propTypes = {
  falcor: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

Provider.childContextTypes = {
  falcor: PropTypes.object.isRequired,
  falcorDispatcher: PropTypes.object.isRequired,
};
