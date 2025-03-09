const { createClient } = require('@supabase/supabase-js'); 
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'privateinf.env') });


// Виправлений console.log
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_API_KEY:', process.env.SUPABASE_API_KEY ? 'Loaded' : 'Missing');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseConnection() {
    const { data, error } = await supabase.from('Users').select('*').limit(1);
    if (error) {
        console.error(`Problem with Database connection: ${error.message}`);
    } else {
        console.log('Successful connection to Database');
    }
}

checkDatabaseConnection();

module.exports = supabase;