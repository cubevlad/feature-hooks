type EventName = string
type CallbackConstraint = (...args: any[]) => any
type EventCallback = {
  subscription: CallbackConstraint
}
type EventCallbacksMap = Record<EventName, EventCallback[]>
class EventBus {
  private callbacks: EventCallbacksMap

  constructor() {
    this.callbacks = {}
  }

  public getEventCallbacks = (event: EventName) => {
    if (!event || !this.callbacks[event]) {
      return []
    }

    return this.callbacks[event]
  }

  public getEvents = () => {
    return Object.keys(this.callbacks)
  }

  public registerEvent<T extends CallbackConstraint>(event: EventName, callback: T) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }

    this.callbacks[event].push({
      subscription: callback,
    })
  }

  public unregisterEventCallback<T extends CallbackConstraint>(event: EventName, callback: T) {
    const events = this.callbacks[event]
    if (!events?.length) {
      return
    }

    this.callbacks[event] = this.callbacks[event].filter(
      ({ subscription }) => subscription !== callback
    )
  }

  public unregisterEvent(event: EventName) {
    if (!this.callbacks[event]) return
    this.callbacks[event] = []
  }

  public publish<
    T extends EventName,
    U extends Parameters<CallbackConstraint> | undefined = undefined,
  >(...args: U extends undefined ? [T] : [T, U]) {
    const arity = args.length
    if (!arity) {
      return
    }

    const event = args[0]
    const argsToInvoke = arity >= 2 ? args.slice(1) : []

    if (!this.callbacks[event]) {
      return
    }

    this.callbacks[event].forEach(cb => {
      cb.subscription(...argsToInvoke)
    })
  }
}

export { EventBus }
