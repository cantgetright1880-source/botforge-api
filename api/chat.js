// BotForge Chat API
// Handles chat messages and bot responses

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Bot responses
const botResponses = {
    anna: {
        greeting: "Hi! I'm Anna, here to help you with any questions.",
        keywords: {
            price: "We have plans from $19.99/month. Check our pricing page!",
            cost: "We have plans from $19.99/month. Check our pricing page!",
            feature: "BotForge offers AI chatbots, human handoff, analytics, and more!",
            help: "I'm here to help! What would you like to know?",
            human: "I'll connect you with a human right away!"
        }
    },
    max: {
        greeting: "Hey! I'm Max. Looking to level up your customer support?",
        keywords: {
            price: "Basic $19.99, Starter $29.99, Professional $79.99, Enterprise $199.99",
            buy: "Great choice! https://cantgetright1880-source.github.io/smokey-raven/pricing.html",
            demo: "I'd love to show you a demo! Which plan interests you?",
            feature: "AI-powered support, analytics, integrations, and 24/7 availability!"
        }
    },
    chloe: {
        greeting: "Welcome to BotForge! I'm Chloe - let's get you set up!",
        keywords: {
            setup: "Step 1: Profile → Step 2: Knowledge base → Step 3: Customize → Step 4: Go live!",
            start: "Let's get started! Tell me about your business.",
            help: "I'm here to guide you through setup! What do you need?"
        }
    },
    viva: {
        greeting: "Hey there! I'm Viva. Let me tell you about BotForge!",
        keywords: {
            feature: "AI-powered responses, 24/7 support, easy setup, affordable pricing!",
            try: "Try it free! https://cantgetright1880-source.github.io/smokey-raven/pricing.html",
            social: "Join 500+ businesses using BotForge!"
        }
    }
};

function getBotResponse(botId, message) {
    const bot = botResponses[botId] || botResponses.anna;
    const msg = message.toLowerCase();
    
    // Check keywords
    for (const [key, response] of Object.entries(bot.keywords)) {
        if (msg.includes(key)) return response;
    }
    
    return "Thanks for reaching out! Would you like to learn more about our pricing?";
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { botId, message, userId, conversationId } = req.body;
        
        // Get bot response
        const botResponse = getBotResponse(botId || 'anna', message);
        
        // Save conversation to database
        if (conversationId) {
            // Update existing conversation
            const { data: existing } = await supabase
                .from('conversations')
                .select('messages')
                .eq('id', conversationId)
                .single();
            
            if (existing) {
                const messages = existing.messages || [];
                messages.push({ role: 'user', text: message, timestamp: new Date().toISOString() });
                messages.push({ role: 'bot', text: botResponse, timestamp: new Date().toISOString() });
                
                await supabase
                    .from('conversations')
                    .update({ messages })
                    .eq('id', conversationId);
            }
        }
        
        return res.status(200).json({
            success: true,
            response: botResponse,
            bot: botId || 'anna'
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
