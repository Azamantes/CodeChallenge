'use strict';

const regexp = {
	name: /^[a-z]+(( [a-z]+)+)$/i,
	number: /^[0-9]+$/,
	email: /.*/g,
	cardNumber: /^\d{4}( \d{4}){3}$/,
	expiry: /^(0[1-9]|1[0-2])\/(2[01][0-9]{2})$/,
	customerID: /^cus_[0-9a-z]{14}$/i,
};
const paymentTypes = ['card'];

class OrderHandler {
	static parse(config) {
		const order = config[Object.keys(config)[0]]; // get the order subobject ...
		const [exp_month, exp_year] = order.payment.details.expiry.split(/\//);
		
		return {
			customerEmail: order.customer.email,
			amount: OrderHandler.convertToCents(+order.product.price),
			paymentType: order.payment.type,
			paymentDetails: {
				exp_month,
				exp_year,
				number: order.payment.details.number,
				cvc: order.payment.details.cvc,
			},
		};
	}
	static convertToCents(number) {
	    const [i, d] = ('' + number).split(/\./);
	    let a = +i * 100,
	    	b = +(d || '0').slice(0, 2),
	    	c = +(d || '0').slice(2)? 1 : 0;
	    return a + b + c;
	}
	static validate(result) { // *cough* ... *cough* ...
		return true;
		const regexp = this.regexp;
		let box;
		if(!result.hasOwnProperty('customer')) return false;
		
		box = result.customer.email;
		if(typeof box !== 'string' || !regexp.email.test(box)) return false;
		if(!result.hasOwnProperty('amount')) return false;

		box = result.product;
		if(typeof box !== 'number' || !regexp.number.test(box)) return false;
		if(!result.hasOwnProperty('payment')) return false;
		if(!result.payment.hasOwnProperty('type')) return false;

		box = result.payment.type;
		if(typeof box !== 'string' || !this.paymentTypes.includes(box)) return false;
		if(!result.payment.hasOwnProperty('number')) return false;

		box = result.payment.number;
		if(typeof box !== 'string' || !regexp.cardNumber.test(box)) return false;
		if(!result.payment.hasOwnProperty('expiry')) return false;

		box = result.payment.expiry;
		if(typeof box !== 'string' || !regexp.expiry.test(box)) return false;
		if(!result.payment.hasOwnProperty('cvc')) return false;

		box = result.payment.cvc;
		if(typeof box !== 'number' || !regexp.number.test(box)) return false;

		return true;
	}
}

module.exports = OrderHandler;