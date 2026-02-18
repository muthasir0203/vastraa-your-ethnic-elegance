import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://ddzgemgqhnwzdmklzlya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkemdlbWdxaG53emRta2x6bHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDU0MDIsImV4cCI6MjA4Njg4MTQwMn0.kuszGxw8EA0qBIxwna23GxPyF-bpTpQQbpkLSOKTrm4';
const supabase = createClient(supabaseUrl, supabaseKey);

const newProducts = [
    {
        name: "Classic Red Silk Saree",
        description: "A stunning red silk saree perfect for weddings and special occasions. Features intricate golden borders.",
        price: 4999,
        original_price: 8999,
        stock_quantity: 15,
        vehicle: "Sarees",
        fabric: "Silk",
        image_url: "/red-saree.jpg"
    },
    {
        name: "Aesthetic Pink Georgette Saree",
        description: "Lightweight and trendy pink georgette saree with a modern aesthetic. Ideal for parties and casual wear.",
        price: 2499,
        original_price: 3999,
        stock_quantity: 25,
        vehicle: "Sarees",
        fabric: "Georgette",
        image_url: "/aesthetic-pink-saree.jpg"
    },
    {
        name: "Pistachio Green Handloom Khadi Silk",
        description: "Elegant pistachio green woven handloom Khadi silk saree. A perfect blend of tradition and comfort.",
        price: 3499,
        original_price: 5499,
        stock_quantity: 10,
        vehicle: "Sarees",
        fabric: "Cotton",
        image_url: "/pistachio-green-saree.jpg"
    },
    {
        name: "Royal Blue Silk Saree",
        description: "Rich royal blue silk saree with traditional motifs. Gives a regal look for any function.",
        price: 4499,
        original_price: 7999,
        stock_quantity: 20,
        vehicle: "Sarees",
        fabric: "Silk",
        image_url: "/blue-silk-saree.jpg"
    },
    {
        name: "Elegant White Floral Saree",
        description: "Graceful white saree with delicate floral prints. Perfect for day events and summer wear.",
        price: 1999,
        original_price: 2999,
        stock_quantity: 30,
        vehicle: "Sarees",
        fabric: "Chiffon",
        image_url: "/white-floral-saree.jpg"
    }
];

const logStream = fs.createWriteStream('seed_output.txt', { flags: 'a' });
function log(msg: string) {
    console.log(msg);
    logStream.write(msg + '\n');
}

async function seed() {
    log("Starting robust authenticated seed process at " + new Date().toISOString());

    try {
        let authUser = null;

        // 1. Try Login
        log("Attempting login as aanya@gmail.com...");
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: 'aanya@gmail.com',
            password: 'aanya1234567'
        });

        if (!loginError && loginData.user) {
            log("Login successful.");
            authUser = loginData.user;
        } else {
            log(`Login failed: ${loginError?.message || 'Unknown error'}`);

            // 2. Try Signup with same creds
            log("Attempting signup as aanya@gmail.com...");
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: 'aanya@gmail.com',
                password: 'aanya1234567'
            });

            if (!signUpError && signUpData.user) {
                log("Signup successful.");
                authUser = signUpData.user;
            } else {
                log(`Signup failed: ${signUpError?.message || 'Unknown error'}`);

                // 3. Try Random User
                const randomEmail = `seeder_${Date.now()}@test.com`;
                log(`Attempting random user creation: ${randomEmail}...`);
                const { data: randData, error: randError } = await supabase.auth.signUp({
                    email: randomEmail,
                    password: 'password123'
                });

                if (!randError && randData.user) {
                    log("Random user creation successful.");
                    authUser = randData.user;
                } else {
                    log(`Random user creation failed: ${randError?.message}`);
                    throw new Error("Cannot authenticate to seed data.");
                }
            }
        }

        log(`Authenticated User ID: ${authUser.id}`);

        // Check categories
        const { data: allCats } = await supabase.from("categories").select("id, name");
        log(`Existing categories: ${JSON.stringify(allCats)}`);

        let categoryId;
        const sareeCat = allCats?.find(c => c.name === "Sarees");

        if (sareeCat) {
            categoryId = sareeCat.id;
            log(`Found 'Sarees' category ID: ${categoryId}`);
        } else {
            log(`Category 'Sarees' not found. Attempting to create it...`);
            // Try creating it if missing
            const { data: newCat, error: createCatError } = await supabase
                .from("categories")
                .insert([{ name: "Sarees", slug: "sarees", description: "Traditional Sarees" }])
                .select()
                .single();

            if (createCatError) {
                log(`Failed to create category: ${createCatError.message}`);
                // If duplicate key error, try fetching again?
                throw createCatError;
            }
            categoryId = newCat.id;
            log(`Created 'Sarees' category ID: ${categoryId}`);
        }

        // Insert Products
        for (const p of newProducts) {
            log(`Inserting ${p.name}...`);

            const payload = {
                name: p.name,
                description: p.description,
                price: p.price,
                stock_quantity: p.stock_quantity,
                category_id: categoryId,
            };

            const { data: productData, error: prodError } = await supabase
                .from("products")
                .insert([payload])
                .select()
                .single();

            if (prodError) {
                log(`Failed to insert ${p.name}: ${prodError.message}`);
                continue;
            }

            const productId = productData.id;
            log(`Inserted product: ${p.name} (ID: ${productId})`);

            // Insert Image
            const { error: imgError } = await supabase
                .from("product_images")
                .insert([
                    {
                        product_id: productId,
                        url: p.image_url,
                        is_primary: true,
                    },
                ]);

            if (imgError) {
                log(`Failed to link image for ${p.name}: ${imgError.message}`);
            } else {
                log(`Linked image for ${p.name}`);
            }
        }

        log("Seeding complete!");
    } catch (err: any) {
        log(`Critical error: ${err.message}`);
    } finally {
        logStream.end();
    }
}

seed();
