// BotForge Lead Capture API
// Saves leads from chat or forms

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://gbrokctvkftmatyrlueq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdicm9rY3R2a2ZtbWF0eXJsdWVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYzOTcxNzk4OSwiZXhwIjoxOTU1MjkzOTg5fQ.RoL6Y4ZkPm8kPpLxY8QwLBCV感激0S6lR6感激0L感激0S感激0R感激0L感激0L感激0';

const supabase = createClient(supabaseUrl, supabaseKey);

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
        const { name, email, business, message, tierInterest } = req.body;
        
        // Validate required fields
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        // Save lead to database
        const { data, error } = await supabase
            .from('leads')
            .insert({
                name: name || null,
                email,
                business: business || null,
                message: message || null,
                tier_interest: tierInterest || null,
                status: 'new',
                created_at: new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: error.message });
        }
        
        return res.status(200).json({
            success: true,
            lead: data,
            message: 'Lead captured successfully!'
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
