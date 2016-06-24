'use strict';

const PATH = __dirname;
const assert = require('chai').assert;
const expect = require('chai').expect;

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


describe('new order', () => {
	const config = Handler.parse(Example);

	describe('#parsed order -> config', () => {
		describe('config should be an object', () => {
			it('config is not null', () => assert.isNotNull(config, 'OK'));
			it('config is an object', () => assert.isObject(config, 'OK'));
		});

		describe('config: properties', () => {
			it('customerEmail', () => expect(config).to.have.property('customerEmail'));
			it('amount', 		() => expect(config).to.have.property('amount'));
			it('payment', 		() => expect(config).to.have.property('payment'));
			it('paymentType', 	() => expect(config).to.have.property('paymentType'));
		});

		describe('config.paymentDetails: properties', () => {
			it('exp_month', () => expect(config.payment).to.have.property('exp_month'));
			it('exp_year', 	() => expect(config.payment).to.have.property('exp_year'));
			it('number', 	() => expect(config.payment).to.have.property('number'));
			it('cvc', 		() => expect(config.payment).to.have.property('cvc'));
		});

		describe('config: checking values', () => {
			it('checking customerEmail ...', () => assert.isTrue(Handler.validateEmail(config.customerEmail)));
			it('checking amount ...', () => assert.isTrue(Handler.validateAmount(config.amount)));
			it('checking paymentType ...', () => assert.isTrue(Handler.validatePaymentType(config.paymentType)));
			it('checking payment.expiry ...', () => assert.isTrue(Handler.validatePaymentExpiry(config.payment.exp_month, config.payment.exp_year)));
			it('checking payment.number ...', () => assert.isTrue(Handler.validatePaymentNumber(config.payment.number)));
			it('checking payment.cvc ...', () => assert.isTrue(Handler.validatePaymentCVC(config.payment.cvc)));
		});
	});

	it('should end successfully :)', function(done) {
		this.timeout(10000);

		const order = root.push();
		order.set({
			amount: config.amount,
			customerEmail: config.customerEmail,
		});

		setTimeout(() => {
			// ---------------------------
			// STRIPE + Firebase update
			// ---------------------------
			let customerID;
			
			Stripe.tokens.create({
				[config.paymentType]: config.payment,
			}).then(token => {
				it('should return token with an ID', () => {
					expect(token.id).to.match(/.+/);
				});

				console.log('Created token:', token.id);
				
				return Stripe.customers.create({
					source: token.id,
					email: config.customerEmail,
				});
			}, error => {
				console.error('CHARGE ERROR\n', error);
			}).then(customer => {
				it('customer is an Object', () => {
					assert.isObject(customer);
				});
				it('customer.id matches regexp', () => {
					expect(customer.id).to.match(/^cus_[0-9a-z]{14}$/i);
				});

				console.log('Created customer:', customer.id);

				return Stripe.charges.create({
					customer: (customerID = customer.id),
					amount: config.amount,
					currency: 'usd',
				});
			}, error => {
				console.error('CHARGE ERROR\n', error);
			}).then(charge => {
				it('charge is an Object', () => {
					assert.isObject(charge);
				});
				it('charge.id matches regexp', () => {
					expect(charge.id).to.be.a.string();
				});

				console.log('Created charge:', charge.id);

				order.update({
					customerID,
					'chargeID': charge.id,
				});
			}, error => {
				console.error('CHARGE ERROR\n', error);
			}).then(() => {
				console.log('Done :)');
				done();
			});
		}, 1500);
	});
});