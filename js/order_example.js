// -------------------
// ORDER EXAMPLE
// -------------------
'use strict';

module.exports = {
	"O1": {
		"customer": {
			"id": "C1",
			"name": "John Smith",
			"email": "john@smith.com"
		},
		"product": {
			"id": "I1",
			"name": "Item",
			"price": 3.99
		},
		"payment": {
			"type": "card",
			"details": {
				"number": "4000 0566 5566 5556",
				"expiry": "02/2020",
				"cvc": 222
			}
		}
	}
};