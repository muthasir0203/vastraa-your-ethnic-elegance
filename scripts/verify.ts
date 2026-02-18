import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://ddzgemgqhnwzdmklzlya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkemdlbWdxaG53emRta2x6bHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDU0MDIsImV4cCI6MjA4Njg4MTQwMn0.kuszGxw8EA0qBIxwna23GxPyF-bpTpQQbpkLSOKTrm4';
const supabase = createClient(supabaseUrl, supabaseKey);

const logStream = fs.createWriteStream('verify_output.txt', { flags: 'w' });
function log(msg: string) {
    console.log(msg);
    logStream.write(msg + '\n');
}

async function verify() {
    log("Starting detailed verification...");

    // 1. Authenticate (Try robustly like Seed.tsx)
    let authUser = null;
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'aanya@gmail.com',
        password: 'aanya1234567'
    });

    if (!loginError && loginData.user) {
        log("Login successful.");
        authUser = loginData.user;
    } else {
        log(`Login failed: ${loginError?.message}. Trying random user...`);
        const randomEmail = `verifier_${Date.now()}@test.com`;
        const { data: randData, error: randError } = await supabase.auth.signUp({
            email: randomEmail,
            password: 'password123'
        });
        if (!randError && randData.user) {
            log("Random user creation successful.");
            authUser = randData.user;
        } else {
            log(`Random user creation failed: ${randError?.message}`);
        }
    }

    // 2. Check Categories
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*');

    if (catError) {
        log(`Error fetching categories: ${catError.message}`);
    } else {
        log(`Categories found: ${categories?.length}`);
        categories?.forEach(c => log(` - [${c.id}] ${c.name} (slug: ${c.slug})`));
    }

    // 3. Check Products
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select(`
        id, 
        name, 
        category_id, 
        stock_quantity,
        category:categories(name, slug)
    `)
        .order('created_at', { ascending: false })
        .limit(20);

    if (prodError) {
        log(`Error fetching products: ${prodError.message}`);
    } else {
        log(`Recent products found: ${products?.length}`);
        products?.forEach(p => {
            log(` - [${p.id}] ${p.name}`);
            log(`   Category ID: ${p.category_id}`);
            // @ts-ignore
            log(`   Linked Category: ${p.category?.name} (${p.category?.slug})`);
        });
    }
}

verify().finally(() => logStream.end());
