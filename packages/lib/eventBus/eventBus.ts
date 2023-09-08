type Index = number;
type Event = string;
type CallbackConstraint = (...args: any[]) => any;
type EventCallback = {
  subscription: CallbackConstraint;
  index: Index;
};
type EventCallbacks = Record<Event, EventCallback[]>;

export class EventBus {
  private static instance: EventBus;

  private callbacks: EventCallbacks;
  private nextSubscriptionIndex: Index;

  constructor() {
    this.callbacks = {};
    this.nextSubscriptionIndex = 0;
  }

  /** get the instance of EvenBus */
  public getInstance() {
    if (!EventBus.instance || !(EventBus.instance instanceof EventBus)) {
      EventBus.instance = new EventBus();
    }

    return EventBus.instance;
  }

  /**
   * Subscribe to event
   * @param event name of event
   * @param callback callback to trigger after publishing of event
   */
  public subscribe<T extends CallbackConstraint>(event: Event, callback: T) {
    if (!this.callbacks[event]) this.callbacks[event] = [];

    this.callbacks[event].push({
      subscription: callback,
      index: this.nextSubscriptionIndex,
    });

    this.nextSubscriptionIndex += 1;
  }

  /**
   * Unregister callback from event callbacks collection
   * @param cb callback to unregister from event callbacks collection
   */
  public unregisterCallback<T extends CallbackConstraint>(cb: T) {
    const events = Object.keys(this.callbacks);
    events.forEach((event) => {
      this.callbacks[event] = this.callbacks[event].filter(
        ({ subscription }) => subscription !== cb,
      );
    });
  }

  /**
   * Clean up callbacks from event
   * @param event name of event to clean up
   */
  public unregisterCallbacksForEvent(event: Event) {
    if (!this.callbacks[event]) return;
    this.callbacks[event] = [];
  }

  /**
   * Clean up all events and events callbacks
   */
  public unregisterAllCallbacks() {
    this.callbacks = {};
  }

  /**
   * Trigger event callbacks
   * @param arguments - array of events or a one event to fire
   */
  public publish() {
    const event = arguments[0];
    const args = arguments.length >= 2 ? Array.prototype.slice.call(arguments, 1) : [];

    if (!this.callbacks[event]) return;

    this.callbacks[event].forEach((cb) => cb.subscription.apply(null, args));
  }
}
