import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Simple .env parser
function loadEnv(path) {
    if (!fs.existsSync(path)) return;
    const content = fs.readFileSync(path, 'utf8');
    content.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    });
}

loadEnv(join(__dirname, '../.env'));

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
}

const client = new Client({
    connectionString,
});

async function fix() {
    try {
        await client.connect();
        console.log('Connected to database.');

        // 1. Add original_price column if missing
        console.log('Checking for original_price column...');
        await client.query(`
            ALTER TABLE products 
            ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2);
        `);
        console.log('Checked/Added original_price column.');

        // 2. Add RLS policies
        console.log('Adding RLS policies...');
        const policies = [
            ["Admins can insert categories", "categories", "FOR INSERT WITH CHECK (true)"],
            ["Admins can update categories", "categories", "FOR UPDATE USING (true)"],
            ["Admins can delete categories", "categories", "FOR DELETE USING (true)"],
            ["Admins can insert products", "products", "FOR INSERT WITH CHECK (true)"],
            ["Admins can update products", "products", "FOR UPDATE USING (true)"],
            ["Admins can delete products", "products", "FOR DELETE USING (true)"],
            ["Admins can insert product_images", "product_images", "FOR INSERT WITH CHECK (true)"],
            ["Admins can update product_images", "product_images", "FOR UPDATE USING (true)"],
            ["Admins can delete product_images", "product_images", "FOR DELETE USING (true)"]
        ];

        for (const [name, table, logic] of policies) {
            await client.query(`
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_policies 
                        WHERE policyname = '${name}' AND tablename = '${table}'
                    ) THEN
                        EXECUTE 'CREATE POLICY "${name}" ON ${table} ${logic}';
                    END IF;
                END
                $$;
            `);
        }
        console.log('RLS policies checked/added.');

        // 3. Refresh PostgREST cache
        try {
            await client.query('NOTIFY pgrst, "reload schema";');
            console.log('Notified PostgREST to reload schema.');
        } catch (e) {
            console.log('Could not notify PostgREST:', e.message);
        }

        console.log('Fix applied successfully.');
    } catch (err) {
        console.error('Error applying fix:', err);
    } finally {
        await client.end();
    }
}

fix();
