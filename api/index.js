// BotForge API - Main entry point
// Vercel serverless functions

const supabaseUrl = process.env.SUPABASE_URL || 'https://gbrokctvkftmatyrlueq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdicm9rY3R2a2ZtbWF0eXJsdWVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYzOTcxNzk4OSwiZXhwIjoxOTU1MjkzOTg5fQ.RoL6Y4ZkPm8kPpLxY8QwLBCV感激0S6lR6感激0L感激0S感激0R感激0L感激0L感激0';

// Simple in-memory bot responses (would use AI in production)
const botResponses = {
    anna: {
        greeting: "Hi! I'm Anna, here to help you with any questions.",
        responses: {
            default: "I'd be happy to help with that! Let me explain...",
            pricing: "We have plans starting at $19.99/month. Would you like me to tell you more?",
            features: "BotForge offers AI-powered chatbots, human handoff, analytics, and more!",
            help: "I'm here to help! What questions do you have?",
            human: "I'll connect you with a human right away. Please hold..."
        }
    },
    max: {
        greeting: "Hey! I'm Max. Looking to level up your customer support?",
        responses: {
            default: "That's a great question! Let me tell you about our plans...",
            pricing: "We have Basic ($19.99), Starter ($29.99), Professional ($79.99), and Enterprise ($199.99).",
            demo: "I'd love to show you a demo! Which plan interests you most?",
            buy: "Great choice! Here's the checkout link: https://cantgetright1880-source.github.io/smokey-raven/pricing.html"
        }
    },
    chloe: {
        greeting: "Welcome to BotForge! I'm Chloe - let's get you set up!",
        responses: {
            default: "Awesome! Let me walk you through the setup process...",
            setup: "Step 1: Complete your business profile. Step 2: Upload knowledge base. Step 3: Customize your bot!",
            start: "Let's get started! First, tell me about your business.",
            help: "I'm here to help you get set up! What do you need guidance on?"
        }
    },
    viva: {
        greeting: "Hey there! I'm Viva. Let me tell you about BotForge!",
        responses: {
            default: "You're going to love BotForge! Here's why...",
            features: "Our top features: AI-powered responses, 24/7 support, easy setup, and affordable pricing!",
            try: "Want to try it free? Head to our pricing page!",
            social: "Join 500+ businesses already using BotForge!"
        }
    }
};

// Get bot response based on message
function getBotResponse(botId, message) {
    const bot = botResponses[botId];
    if (!bot) return botResponses.anna.responses.default;
    
    const msg = message.toLowerCase();
    
    // Check for keywords
    if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
        return bot.responses.pricing || bot.responses.default;
    }
    if (msg.includes('feature') || msg.includes('what do')) {
        return bot.responses.features || bot.responses.default;
    }
    if (msg.includes('help') || msg.includes('help')) {
        return bot.responses.help || bot.responses.default;
    }
    if (msg.includes('human') || msg.includes('person') || msg.includes('talk to')) {
        return "I'll connect you with a human right away. Please hold...";
    }
    if (msg.includes('buy') || msg.includes('purchase') || msg.includes('sign up')) {
        return bot.responses.buy || "Great choice! Check our pricing page: https://cantgetright1880-source.github.io/smokey-raven/pricing.html";
    }
    
    return bot.responses.default;
}

module.exports = {
    supabaseUrl,
    supabaseKey,
    botResponses,
    getBotResponse
};
