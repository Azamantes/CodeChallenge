'use strict';

class OrderHandler {
	constructor() {
		this.regexp = {
			name: /^[a-z]+(( [a-z]+)+)$/i,
			number: /^[0-9]+$/,
			email: /.*/g,
			cardNumber: /^(\d{4} ){3}\d{4}$/,
			expiry: /^(0[1-9]|1[0-2])\/(2[01][0-9]{2})$/,
		};
		this.paymentTypes = ['card'];
	}
	parse(config) {
		// Skipping the O1 key...
		const key = Object.keys(config)[0];
		const order = config[key];

		const customer = order.customer;
		const product = order.product;
		const payment = order.payment;

		// Our meat and potatoes...
		const result = {};
		result.customer = {
			name: '' + customer.name,
			email: '' + customer.email,
		};
		result.product = ('' + product.id).toNumber();
		result.payment = {
			type: payment.type,
			number: payment.details.number,
			expiry: payment.details.expiry,
			cvc: +payment.details.cvc, // number
		};

		const isValid = this.validate(result);
		if(!isValid) {
			console.log('OrderHandler :: parse :: result is not valid.');
			return null;
		}

		return result;
	}
	validate(result) { // *cough* ... *cough* ...
		const regexp = this.regexp;
		let box;
		if(!result.hasOwnProperty('customer')) {
			console.log('customer');
			return false;
		}
		
		box = result.customer.name;
		if(typeof box !== 'string' || !regexp.name.test(box)) {
			console.log('customer name');
			return false;
		}

		box = result.customer.email;
		if(typeof box !== 'string' || !regexp.email.test(box)) {
			console.log('customer email');
			return false;
		}
		if(!result.hasOwnProperty('product')) {
			console.log('product');
			return false;
		}

		box = result.product;
		if(typeof box !== 'number' || !regexp.number.test(box)) {
			console.log('product ID');
			return false;
		}
		if(!result.hasOwnProperty('payment')) {
			console.log('payment');
			return false;
		}
		if(!result.payment.hasOwnProperty('type')) {
			console.log('payment');
			return false;
		}

		box = result.payment.type;
		// console.log(box);
		if(typeof box !== 'string' || !this.paymentTypes.includes(box)) { //~this.paymentTypes.indexOf(box)) { // or !this.paymentTypes.includes(...)
			console.log('payment type', typeof box, ~this.paymentTypes.indexOf(box));
			return false;
		}
		if(!result.payment.hasOwnProperty('number')) {
			console.log('payment');
			return false;
		}

		box = result.payment.number;
		if(typeof box !== 'string' || !regexp.cardNumber.test(box)) { // or !this.paymentTypes.includes(...)
			console.log('payment number');
			return false;
		}
		if(!result.payment.hasOwnProperty('expiry')) {
			console.log('payment');
			return false;
		}

		box = result.payment.expiry;
		if(typeof box !== 'string' || !regexp.expiry.test(box)) { // or !this.paymentTypes.includes(...)
			console.log('payment expiry');
			return false;
		}
		if(!result.payment.hasOwnProperty('cvc')) {
			console.log('payment');
			return false;
		}

		box = result.payment.cvc;
		if(typeof box !== 'number' || !regexp.number.test(box)) { // or !this.paymentTypes.includes(...)
			console.log('payment cvc');
			return false;
		}

		return true;
	}
}

module.exports = OrderHandler;

// -----------

String.prototype.toNumber = function() {
	return +this.replace(/[^\d]/g, '');
};

// function parseOrder(data) {
// 	const key = Object.keys(data)[0];
// 	const order = data[key];
// 	const orderID = getNumber(key);

// 	const customer = order.customer;
// 	const product = order.product;
// 	const payment = order.payment;

// 	const result = {
// 		id: getNumber(Object.keys(data)[0]),
// 		customer: {
// 			id: customer.id.toNumber(),
// 			name: '' + customer.name,
// 			email: '' + customer.email,
// 		},
// 		product: {
// 			id: product.id.toNumber(),
// 			name: '' + product.name,
// 			price: +product.price,
// 		},
// 		payment: {
// 			type: payment.type,
// 			details: {
// 				number: payment.details.number,
// 				expiry: payment.details.expiry,
// 				cvc: +payment.details.cvc,
// 			}
// 		},
// 	};
	
// 	console.log(result);

// }