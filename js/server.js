'use strict';

// -------------------
// DEPENDENCIES
// -------------------
const PATH = __dirname;
const Firebase = require('firebase');
const Handler = require('./order_handler.js'); // order parser
const Table = require('./table.js'); // order parser
const ORDER_EXAMPLE = require('./order_example.js'); // order parser

// -------------------
// FIREBASE
// -------------------
Firebase.initializeApp({
  serviceAccount: `${PATH}/../CodeChallenge-7233efcc3dbb.json`,
  databaseURL: 'https://codechallenge-b1156.firebaseio.com'
});
const database = new Firebase.database();


// -------------------
// "TABLES"
// -------------------
const Products = new Table({
	ref: database.ref('products'),
	blocked: true,
});
const Customers = new Table({
	ref: database.ref('customers'),
});
const Orders = new Table({
	ref: database.ref('orders'),
});
const OrderHandler = new Handler();

setInterval(() => {
	const order = OrderHandler.parse(ORDER_EXAMPLE);
	if(order === null) {
		return !!console.log('order is invalid');
	}

	Customers.insert(order.customer);
}, 2000);