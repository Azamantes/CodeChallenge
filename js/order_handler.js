'use strict';

class OrderHandler {
	parse(order) {
		const result = {};
		result.customer = {

		};
		result.product = +order.product;
	}
}

module.exports = OrderHandler;

// -----------

String.prototype.toNumber = function() {
	return +this.replace(/[^\d]/g, '');
};

function parseOrder(data) {
	const key = Object.keys(data)[0];
	const order = data[key];
	const orderID = getNumber(key);

	const customer = order.customer;	
	const product = order.product;
	const payment = order.payment;

	const result = {
		id: getNumber(Object.keys(data)[0]),
		customer: {
			id: customer.id.toNumber(),
			name: '' + customer.name,
			email: '' + customer.email,
		},
		product: {
			id: product.id.toNumber(),
			name: '' + product.name,
			price: +product.price,
		},
		payment: {
			type: payment.type,
			details: {
				number: payment.details.number,
				expiry: payment.details.expiry,
				cvc: +payment.details.cvc,
			}
		},
	};
	
	console.log(result);

}

function getNumber(value) {
	
}