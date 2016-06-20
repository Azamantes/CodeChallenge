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
  serviceAccount: `${PATH}\\CodeChallenge-7233efcc3dbb.json`,
  databaseURL: 'https://codechallenge-b1156.firebaseio.com'
});
const database = new Firebase.database();


// -------------------
// "TABLES"
// -------------------
const Products = new Table({
	ref: database.ref('products'),
});
const Customers = new Table({
	ref: database.ref('customers'),
});
const Orders = new Table({
	ref: database.ref('orders'),
});

const OrderHandler = new Handler();

/*
let order = {
	customer: {
		name: 'John Smith',
		email: 'john@smith.com',
	},
	productID: 1,
	payment: {
		number: '4000 0566 5566 5556',
		expiry: '02/2020',
		cvc: 222,
	}
}

*/





// -------------------
// ORDERS
// -------------------
// const orders = database.ref('orders');
// let orderID;

// orders.set({
// 	last: 0,
// 	list: {},
// });
// orders.on('value', data => {
// 	const root = data.val();
// 	orderID = Object.keys(root.list || []).length;
// 	if(!Queue.passing) Queue.passing = orderID > 0;

// 	console.log('orderID:', orderID);
// });

// setTimeout(() => {
// 	setInterval(() => {
// 		Queue.push(() => {

// 		});
// 		orders.child('list').child(++orderID).set({
// 			number : orderID
// 		});

// 		Queue.next();
// 	}, 1000);
// }, 2000);


// orders.on('child_added', data => {})
// orders.on('child_removed', data => {})









// Firebase.initializeApp({
// 	apiKey: "AIzaSyBgg0NK60Wy5xhi2CoVnBQKnnJGJoN5QFc",
// 	authDomain: "codechallenge-b1156.firebaseapp.com",
// 	databaseURL: "https://codechallenge-b1156.firebaseio.com",
// 	storageBucket: "codechallenge-b1156.appspot.com",
// });
