import { EventEmitter } from 'events';

class OrderEventEmitter extends EventEmitter {}

export const orderEvents = new OrderEventEmitter();
// Increase listener limit to prevent memory leak warnings
orderEvents.setMaxListeners(100);
