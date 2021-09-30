const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors')({
    origin: '*'
});
// Remember to set token using >> firebase functions:config:set stripe.token="SECRET_STRIPE_TOKEN_HERE"
const stripe = require('stripe')(functions.config().stripe.token);

// Create express app
const app = express();
app.use(cors);

// Calculates the cost of a payment based on items provided
const calculateOrderAmount = (items) => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "usd"
    });
    res.send({
        clientSecret: paymentIntent.client_secret
    });
});

exports.charge = functions.https.onRequest(app);