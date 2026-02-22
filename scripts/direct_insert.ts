import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

const connectionString = process.env.DATABASE_URL;

async function run() {
    if (!connectionString) {
        console.error('DATABASE_URL not found in .env');
        process.exit(1);
    }

    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        // 1. Get Category ID for 'Sarees'
        const catRes = await client.query("SELECT id FROM categories WHERE name = 'Sarees' LIMIT 1");
        let categoryId;
        if (catRes.rows.length > 0) {
            categoryId = catRes.rows[0].id;
            console.log(`Found 'Sarees' category ID: ${categoryId}`);
        } else {
            // Create category if not exists
            const insertCatRes = await client.query(
                "INSERT INTO categories (name, slug) VALUES ('Sarees', 'sarees') RETURNING id"
            );
            categoryId = insertCatRes.rows[0].id;
            console.log(`Created 'Sarees' category ID: ${categoryId}`);
        }

        // 2. Insert Product
        const productRes = await client.query(
            `INSERT INTO products (category_id, name, description, price, stock_quantity) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [
                categoryId,
                'Wine Colour Lichi Silk Traditional Saree VSSD1112204',
                'PRODUCT DETAILS Grab These Stunning Festive Wear Sarees In Beautiful, Vibrant Colors. Crafted From Luxurious Lichi Silk, The Saree And Blouse Offer A Soft, Elegant Feel. Adorned With Intricately Woven Rich Pallu Designer Work, These Sarees Add A Touch Of Sophistication, Making Them The Perfect Choice For Any Celebration Or Special Occasion.',
                1999.00,
                20
            ]
        );
        const productId = productRes.rows[0].id;
        console.log(`Inserted product ID: ${productId}`);

        // 3. Insert Image
        await client.query(
            "INSERT INTO product_images (product_id, url, is_primary) VALUES ($1, $2, $3)",
            [
                productId,
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop',
                true
            ]
        );
        console.log('Linked image to product.');

        console.log('Seeding successful!');
    } catch (err) {
        console.error('Error during seeding:', err);
    } finally {
        await client.end();
    }
}

run();
