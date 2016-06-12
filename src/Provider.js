import { Component, PropTypes, Children } from 'react';

import Dispatcher from './dispatcher';
import debounce from './utils/debounce';

function attachOnChange(falcor, callBack) {
  const handler = debounce(callBack, 50);

  const root = falcor._root; // eslint-disable-line no-underscore-dangle
  if (!root.onChange) {
    root.onChange = handler;
    return;
  }

  const oldOnChange = root.onChange;
  root.onChange = () => {
    oldOnChange();
    handler();
  };
}

export default class Provider extends Component {
  constructor(props, context) {
    super(props, context);
    this.falcor = props.falcor;
    this.dispatcher = new Dispatcher();
    attachOnChange(this.falcor, this.dispatcher.dispatch.bind(this.dispatcher));
  }

  getChildContext() {
    return { falcor: this.falcor, falcorDispatcher: this.dispatcher };
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
