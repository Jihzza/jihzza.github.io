// THIS IS SERVER-SIDE CODE
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use environment variable

// Note: Netlify automatically makes this an async handler
exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { priceId, quantity, successUrl, cancelUrl } = JSON.parse(event.body);

        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price: priceId,
                quantity: quantity
            }],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ url: session.url, id: session.id }) // Return ID for Stripe redirect
        };
    } catch (err) {
        console.error('Stripe Error:', err.message);
        return {
            statusCode: err.statusCode || 500,
            body: JSON.stringify({ message: err.message })
        };
    }
};