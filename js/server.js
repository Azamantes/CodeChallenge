'use strict';

const PATH = __dirname;

const fs = require('fs');
const CONFIG = JSON.parse(fs.readFileSync(`${PATH}/credentials/config.json`));

const Handler = require('./order_handler.js');
const Example = require('./order_example.js');
const Firebase = require('firebase');
const Stripe = require('stripe')(CONFIG.stripe.key);

// -----------
// INIT
// -----------
Firebase.initializeApp({
	serviceAccount: CONFIG.firebase.account,
	databaseURL: CONFIG.firebase.database,
});
const database = new Firebase.database()
const root = database.ref('/');

// ------------------
// HANDLE NEW ORDER
// ------------------
setTimeout(() => {
	const config = Handler.parse(Example); // simulating new order, normally this `order example` would come from a browser or another server
	if(config === null) {
		console.log('---------------------');
		console.log('Received order was invalid.');
		console.log('---------------------');

		return;
	}

	const order = root.push();
	order.set({
		amount: config.amount,
		customerEmail: config.customerEmail,
	});

	// ---------------------------
	// STRIPE + Firebase update
	// ---------------------------
	let customerID;
	
	Stripe.tokens.create({
		[config.paymentType]: config.payment,
	}).then(token => Stripe.customers.create({
		source: token.id,
		email: config.customerEmail,
	}), error => {
		console.error('TOKEN ERROR\n', error);
	}).then(customer => Stripe.charges.create({
		customer: (customerID = customer.id),
		amount: config.amount,
		currency: 'usd',
	}), error => {
		console.error('CUSTOMER ERROR\n', error);
	}).then(charge => order.update({
		customerID,
		'chargeID': charge.id,
	}), error => {
		console.error('CHARGE ERROR\n', error);
	}).then(() => {
		console.log('Done.');
		process.exit();
	});
}, 1500);