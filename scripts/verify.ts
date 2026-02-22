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

    // 1. Authenticate (Skipping auth for public read access)
    log("Skipping auth for public read access...");
    /*
    let authUser = null;
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'aanya@gmail.com',
        password: 'aanya1234567'
    });
    ...
    */


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
