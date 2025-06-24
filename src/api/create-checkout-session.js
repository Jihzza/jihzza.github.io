// THIS IS SERVER-SIDE CODE - DO NOT PUT IN YOUR REACT APP
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { priceId, quantity, successUrl, cancelUrl } = req.body;

            // Create a checkout session from the user's request
            const session = await stripe.checkout.sessions.create({
                line_items: [{
                    price: priceId, // The ID of the price object in your Stripe dashboard
                    quantity: quantity
                }],
                mode: 'payment',
                success_url: successUrl,
                cancel_url: cancelUrl,
            });

            // Respond with the session's redirect URL or ID
            res.status(200).json({ url: session.url });
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}