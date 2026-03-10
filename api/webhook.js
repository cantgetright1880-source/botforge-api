// BotForge Stripe Webhook
// Handles payment events from Stripe
// Vercel serverless function

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Stripe-Signature');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Get raw body for Stripe signature verification
    // Vercel provides rawBody property on the request for webhook verification
    let rawBody = req.rawBody;
    
    // Fallback: try to reconstruct from body if rawBody not available
    if (!rawBody && req.body) {
        if (Buffer.isBuffer(req.body)) {
            rawBody = req.body.toString('utf8');
        } else if (typeof req.body === 'string') {
            rawBody = req.body;
        } else if (typeof req.body === 'object') {
            rawBody = JSON.stringify(req.body);
        }
    }
    
    if (!rawBody) {
        console.error('No body found in request');
        return res.status(400).send('Webhook Error: No body found');
    }
    
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                
                const { data: customer } = await supabase
                    .from('customers')
                    .insert({
                        email: session.customer_details?.email || session.customer_email,
                        name: session.customer_details?.name,
                        stripe_customer_id: session.customer,
                        plan: session.metadata?.plan || 'starter',
                        created_at: new Date().toISOString()
                    })
                    .select()
                    .single();
                
                if (session.subscription) {
                    await supabase
                        .from('subscriptions')
                        .insert({
                            customer_id: customer?.id,
                            stripe_subscription_id: session.subscription,
                            plan: session.metadata?.plan || 'starter',
                            status: 'active',
                            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                            created_at: new Date().toISOString()
                        });
                }
                
                console.log('Checkout completed:', session.id);
                break;
            }
            
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                
                await supabase
                    .from('subscriptions')
                    .update({
                        status: subscription.status,
                        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
                    })
                    .eq('stripe_subscription_id', subscription.id);
                
                break;
            }
            
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                
                await supabase
                    .from('subscriptions')
                    .update({ status: 'canceled' })
                    .eq('stripe_subscription_id', subscription.id);
                
                break;
            }
        }
        
        return res.status(200).json({ received: true });
        
    } catch (error) {
        console.error('Error processing webhook:', error);
        return res.status(500).json({ error: 'Webhook processing failed' });
    }
};
