'use strict';

const paymentTypes = ['card'];
const regexp = {
	customerID: /^cus_[0-9a-z]{14}$/i,
	number: /^[0-9]+$/,
	email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	cardNumber: /^\d{4}( \d{4}){3}$/,
	cardCVC: /^\d{3,4}$/,
	expiry: /^(0[1-9]|1[0-2])\/(2[01][0-9]{2})$/,
	expiryMonth: /^(0[1-9]|1[0-2])$/,
	expiryYear: /(2[01][0-9]{2})/,
};

class OrderHandler {
	static parse(config) {
		const key = Object.keys(config)[0];
		const order = config[key]; // get the order subobject ...
		const [exp_month, exp_year] = order.payment.details.expiry.split(/\//);
		
		const result = {
			customerEmail: order.customer.email,
			amount: OrderHandler.convertToCents(+order.product.price),
			paymentType: order.payment.type,
			payment: {
				exp_month,
				exp_year,
				number: order.payment.details.number,
				cvc: order.payment.details.cvc,
			},
		};

		const isValid = this.validate(result);
		if(!isValid) {
			return null;
		}

		return result;
	}
	static validate(result) {
		const isValidEmail = !!result && this.validateEmail(result.customerEmail);
		const isValidAmount = !!result && this.validateAmount(result.amount);
		const isValidType = !!result && this.validatePaymentType(result.paymentType);

		const isValidExpiry = !!result.payment && this.validatePaymentExpiry(result.payment.exp_month, result.payment.exp_year);
		const isValidNumber = !!result.payment && this.validatePaymentNumber(result.payment.number);
		const isValidCVC = !!result.payment && this.validatePaymentCVC(result.payment.cvc);
		
		if(!isValidEmail) return !!console.error('Email is invalid');
		if(!isValidAmount) return !!console.error('Amount is invalid');
		if(!isValidType) return !!console.error('Type is invalid');
		if(!isValidExpiry) return !!console.error('Expiry is invalid');
		if(!isValidNumber) return !!console.error('Number is invalid');
		if(!isValidCVC) return !!console.error('CVC is invalid');

		return isValidEmail && isValidAmount && isValidType && isValidExpiry && isValidNumber && isValidCVC;
	}

	static validateEmail(value) {
		const isString = typeof value === 'string';
		const isValid = regexp.email.test(value);

		return isString && isValid;
	}
	static validateAmount(value) {
		const result = +value;
		const isNumber = typeof result === 'number';
		const isNotNaN = !isNaN(result);
		const isNotInfinite = isFinite(result);
		const isPositive = result > 0;
		const isInteger = result === (result | 0);

		return isNumber && isNotNaN && isNotInfinite && isPositive && isInteger;
	}
	static validatePaymentType(value) {
		return !!~paymentTypes.indexOf(value);
	}
	static validatePaymentExpiry(month, year) {
		const isMonthValid = regexp.expiryMonth.test(month);
		const isMonthString = typeof month === 'string';
		const isYearValid = regexp.expiryMonth.test(month);
		const isYearString = typeof year === 'string';
		return isMonthValid && isMonthString && isYearValid && isYearString;
	}
	static validatePaymentNumber(value) {
		return regexp.cardNumber.test(value);
	}
	static validatePaymentCVC(value) {
		const is3Or4Digits = regexp.cardCVC.test('' + value);
		const isValid = this.validateAmount(value);
		return is3Or4Digits && isValid;
	}

	static convertToCents(number) {
	    const [i, d] = ('' + number).split(/\./);
	    const a = +i * 100;
	   	const b = +(d || '0').slice(0, 2);
	   	const c = +(d || '0').slice(2)? 1 : 0;
	    
	    return a + b + c;
	}
}

module.exports = OrderHandler;