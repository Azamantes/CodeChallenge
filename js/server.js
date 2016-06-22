'use strict';

const Handler = require('./order_handler.js');
const Example = require('./order_example.js');
const Stripe = require('stripe')('sk_test_Qbk1K5C0eoW44hMfWAVZMz2J');
const Firebase = require('firebase');
Firebase.initializeApp({
	serviceAccount: `${__dirname}\\credentials\\config.json`,
	databaseURL: 'https://codechallenge-b1156.firebaseio.com/'
});
const root = (new Firebase.database()).ref('/');

// -------------------
// NEW ORDER
// -------------------
// setTimeout(() => {
// 	const config = Handler.parse(Example);
// 	// if(!Handler.validate(config)) {
// 	// 	return console.log('Handler :: invalid order.');
// 	// }
	
// 	const order = root.push();
// 	order.set({
// 		amount: config.amount,
// 		customerEmail: config.customerEmail,
// 	});

// 	// ---------------------------
// 	// STRIPE + Firebase update
// 	// ---------------------------
// 	let customerID;
// 	Stripe.tokens.create({
// 		[config.paymentType]: config.paymentDetails,
// 	}).then(token => Stripe.customers.create({
// 			source: token.id,
// 			email: config.customerEmail,
// 	})).then(customer => Stripe.charges.create({
// 			customer: (customerID = customer.id),
// 			amount: config.amount,
// 			currency: 'usd',
// 	})).then(charge => order.update({
// 			'customerID': customerID,
// 			'chargeID': charge.id,
// 	})).catch(error => {
// 		console.error(error)
// 	});
// }, 1500);

console.log('Testing...');