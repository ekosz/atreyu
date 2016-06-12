export default class Dispatcher {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    let isSubscribed = true;

    this.listeners.push(listener);

    function unsubscribe() {
      if (!isSubscribed) return;
      isSubscribed = false;

      const index = this.listeners.indexOf(listener);
      this.listeners.splice(index, 1);
    }

    return unsubscribe.bind(this);
  }

  dispatch() {
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i]();
    }
  }
}
