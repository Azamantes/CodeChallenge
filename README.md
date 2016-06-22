# CodeChallenge

// -------------------
// ORDER EXAMPLE
// -------------------

Order:
- "O1":
	- customer:
		- id: "C1",
 		- name: "John Smith",
 		- email: "john@smith.com"
	- product:
 		- id: "I1",
 		- name: "Item",
 		- price: 3.99
 	- payment:
 		- type: "card",
		- "details
			- number: "4000 0566 5566 5556",
 			- expiry: "02/2020",
 			- cvc: 222


// -------------------
// ORDER CORRECTED
// -------------------

This is an example order I was given. I've found it structured in an inefficient way. It contains superfluous data and in some cases incorrect format.
This is how I would structure the order object:

const order = {
	customerEmail: 'john@smith.com',
	amount: 399, // in cents
	payment: {
		type: 'card',
		number: '4000 0566 5566 5556',
		expiry: '02/2020',
		cvc: 222,
	}
};

// -------------------
// NOTES
// -------------------

According to the task description what I need to handle is:
- new order comes
- add the order to Firebase
- create customer and charge on Stripe
- receive customerID and chargeID from Stripe
- update order in Firebase with the given customerID and chargeID

I have not been provided with any information as to from where the order comes or whether the product information is stored somewhere else,
therefore the only information I need is:

- customer email (Stripe -> customer.email)
- product price (Stripe -> amount)
- payment: (Stripe -> charge)
	- type
	- number
	- expiry
	- cvc