'use strict';

class Queue {
	constructor() {
		this.queue = [];
		this.boolean = false;
	}
	set passing(value) {
		this.boolean = !!value;
	}
	get passing() {
		return this.boolean;
	}
	push(callback) {
		const isFunction = callback instanceof Function;
		if(!isFunction) {
			return !!console.warn('Queue :: callback in not a function');
		}
		
		if(this.moving) {
			callback();
		} else {
			this.queue.push(callback);
		}

		return true;
	}
	next() {
		let callback = this.queue.shift();
		const isFunction = callback instanceof Function;
		if(!isFunction) {
			return false;
		}
		
		callback();

		return true;
	}
}

module.exports = Queue;

// teczefnarjy