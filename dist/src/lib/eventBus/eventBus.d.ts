type EventName = string;
type CallbackConstraint = (...args: any[]) => any;
type EventCallback = {
    subscription: CallbackConstraint;
};
export declare class EventBus {
    private callbacks;
    constructor();
    getEventCallbacks: (event: EventName) => EventCallback[];
    getEvents: () => string[];
    registerEvent<T extends CallbackConstraint>(event: EventName, callback: T): void;
    unregisterEventCallback<T extends CallbackConstraint>(event: EventName, callback: T): void;
    unregisterEvent(event: EventName): void;
    publish<T extends EventName, U extends Parameters<CallbackConstraint> | undefined = undefined>(...args: U extends undefined ? [T] : [T, U]): void;
}
export {};
//# sourceMappingURL=eventBus.d.ts.map