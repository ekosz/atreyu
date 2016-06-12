import React, { Component, PropTypes } from 'react';

import buildPaths from './utils/buildPaths';
import shallowEqual from './utils/shallowEqual';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withQuery(query, options = {}) {
  const { deferRendering = true, pure = true, throwOnError = true } = options;

  return function wrapWithRoot(WrappedComponent) {
    const rootDisplayName = `Connect(${getDisplayName(WrappedComponent)})`;

    class Root extends Component {
      constructor(props, context) {
        super(props, context);

        this.falcor = context.falcor;
        this.unsubscribe = context.falcorDispatcher.subscribe(this.fetchFalcorDeps.bind(this));

        this.state = {
          loading: true,
          data: null,
        };
      }

      componentWillMount() {
        this.fetchFalcorDeps();
      }

      componentWillReceiveProps(nextProps) {
        this.fetchFalcorDeps(nextProps);
      }

      shouldComponentUpdate(nextProps, nextState) {
        return (
          !pure ||
          !shallowEqual(nextProps, this.props) ||
          !shallowEqual(nextState, this.state)
        );
      }

      componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe();
          this.unsubscribe = null;
        }
      }

      fetchFalcorDeps(props = this.props) {
        const paths = buildPaths(query, props);
        if (!paths) return;

        this.setState({ loading: true }, () => {
          this.falcor.get(...paths)
            .then(res => { this.setState({ loading: false, data: res && res.json }); })
            .catch(error => {
              if (throwOnError) throw error;
              this.setState({ error, loading: false });
            });
        });
      }

      falcorProps() {
        return {
          error: this.state.error,
          data: this.state.data,
          get: this.falcor.get.bind(this.falcor),
          set: this.falcor.set.bind(this.falcor),
          call: this.falcor.call.bind(this.falcor),
        };
      }

      render() {
        if (deferRendering && this.state.loading && !this.state.data) return null;

        return <WrappedComponent {...this.props} {...this.falcorProps()} />;
      }
    }

    Root.displayName = rootDisplayName;
    Root.contextTypes = {
      falcor: PropTypes.object,
      falcorDispatcher: PropTypes.object,
    };

    return Root;
  };
}
