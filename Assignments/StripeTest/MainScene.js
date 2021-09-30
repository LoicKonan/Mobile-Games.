const STRIPE_PUBLIC_KEY = 'pk_test_51J5wB9Itxc6RctNUjShhYlyfDAgKminNQKarvZHIDoYdRm4rpr3iBrRlkYcykGmHkQE3K3gMJksKlDActWJtwxfN00H5q9qwZt'; // TODO: PUT YOUR STRIPE PUBLISHABLE KEY HERE
const FIREBASE_FUNCTION = 'https://us-central1-glebe-stripe-test-24.cloudfunctions.net/charge'; // TODO: PUT YOUR FIREBASE FUNCTIONS URL HERE
const stripe = Stripe(STRIPE_PUBLIC_KEY);

class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
        this.card = null;
        this.cardEl = null;
        this.cardObj = null;
        this.paymentObj = null;
        this.paymentEl = null;
    }

    preload() {
        this.load.html('payment-form', './assets/payment-form.html');
    }

    create() {
        // Create a payment form from the HTML template
        this.paymentObj = this.add.dom(225, 200).createFromCache('payment-form');
        this.paymentEl = this.paymentObj.node;
        // Create the card input for Stripe
        this.createStripeCard();
        // Add a callback to the form's button to make purchase
        this.paymentEl.querySelector('#pay-button').addEventListener('click', () => {
            this.startPayment();
        });
    }

    createStripeCard() {
        // Find the card element in the payment form
        this.cardEl = this.paymentEl.querySelector('#card-element');
        // Stripe Elements configuration
        const elements = stripe.elements();
        const style = {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d"
                }
            },
            invalid: {
                fontFamily: 'Arial, sans-serif',
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        };
        // Construct a Stripe Elements Card
        this.card = elements.create("card", { style: style });
        // Stripe injects an iframe into the DOM on a specified element
        this.card.mount(this.cardEl);
        // Listener for changes to stripe card
        this.card.on("change", (event) => {
            // Disable the Pay button if there are no card details in the Element
            this.paymentEl.querySelector("#pay-button").disabled = event.empty;
            this.paymentEl.querySelector("#card-error").innerHTML = event.error ? event.error.message : "&nbsp";
        });
    }

    async startPayment() {
        // Items that the user wants to purchase
        const purchase = {
            items: [{ id: "xl-tshirt" }]
        };
        // Get the payment intent from firebase function
        let result = await fetch(`${FIREBASE_FUNCTION}/create-payment-intent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(purchase)
        })
        // Convert the payment intent into a javascript object
        let data = await result.json();
        // Make the actual purchase
        this.completePayment(stripe, this.card, data.clientSecret);
    }

    async completePayment(stripe, card, clientSecret) {
        // Show a loading symbol of some kind
        // loading(true);
        // Make the payment with stripe using secret id and card description
        let result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card
            }
        });
        // Handle success or failure on client side
        // if (result.error) {
        //     // Show error to your customer
        //     showError(result.error.message);
        // } else {
        //     // The payment succeeded!
        //     orderComplete(result.paymentIntent.id);
        // }
    };
}