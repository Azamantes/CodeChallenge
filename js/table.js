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

		this.last.once('value', data => {
			this[LAST_ID] = data.val();
			if(this[LIST] !== null) {
				this.queue.all();
			}
		});
		this.list.once('value', data => {
			this[LIST] = data.val();
			if(!isNaN(this[LAST_ID])) {
				this.queue.all();
			}
		});
		this.list.on('child_added', data => {

			this.queue.all();
		});
		this.list.on('child_removed', data => {
			
			this.queue.all();
		});
	}
	insert(config) {
		const callback = (() => {
			const id = ++this[LAST_ID];
			this.last.set(id);
			this.list.child(id).set(config);
		}).bind(this);

		if(isNaN(this[LAST_ID]) || this[LIST] === null) {
			console.log();
			this.queue.push(callback);
		} else callback();
	}
}

module.exports = Table;