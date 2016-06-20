'use strict';

// ---------------
// DEPENDENCIES
// ---------------
const Queue = require('./queue.js');

const LAST_ID = Symbol('lastID');
const LIST = Symbol('list');

class Table {
	constructor(config = {}) {
		// if(!(config instanceof Object)) throw new Error('Table :: config is an object.');
		// if(!config) throw new Error('Table :: config is invalid.');
		this[LAST_ID] = NaN;
		this[LIST] = null;
		this.blocked = config.blocked;

		this.ref = config.ref;
		this.last = this.ref.child('last');
		this.list = this.ref.child('list');
		this.queue = new Queue();

		this.ref.on('value', data => {
			const root = data.val();
			this[LIST] = root;
		});
		
	}
	set lastID(value) {
		if(value <= 0) {
			return;
		}

		this[LAST_ID] = value;
		this.last.set(value);
	}
	update(id, config) {
		this.list.child(id).set(config);
		if(!this.blocked) {
			this.list[id] = config;
		}
	}
}

module.exports = Table;