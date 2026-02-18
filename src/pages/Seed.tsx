import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { newProducts } from "@/data/new-products";
import { Button } from "@/components/ui/button";

const Seed = () => {
    const [status, setStatus] = useState<string[]>([]);
    const [isSeeding, setIsSeeding] = useState(false);

    const log = (msg: string) => setStatus((prev) => [...prev, msg]);
    const logSuccess = (msg: string) => setStatus((prev) => [...prev, "✅ " + msg]);
    const logError = (msg: string) => setStatus((prev) => [...prev, "❌ " + msg]);

    const seedProducts = async () => {
        setIsSeeding(true);
        setStatus([]);
        log("Starting seed process...");

        try {
            // 0. Authenticate
            log("Authenticating...");
            const { data: sessionData } = await supabase.auth.getSession();

            if (!sessionData.session) {
                log("No active session. Attempting login as aanya@gmail.com...");
                const { error: loginError } = await supabase.auth.signInWithPassword({
                    email: "aanya@gmail.com",
                    password: "aanya1234567"
                });

                if (loginError) {
                    logError(`Login failed: ${loginError.message}`);

                    if (loginError.message.includes("Invalid login credentials")) {
                        log("Attempting to sign up as aanya@gmail.com...");
                        const { error: signUpError } = await supabase.auth.signUp({
                            email: "aanya@gmail.com",
                            password: "aanya1234567"
                        });

                        if (signUpError) {
                            logError(`Signup failed: ${signUpError.message}`);

                            // Try random user
                            const randomEmail = `seeder_${Date.now()}@test.com`;
                            log(`Attempting to create temporary user: ${randomEmail}...`);
                            const { error: randError } = await supabase.auth.signUp({
                                email: randomEmail,
                                password: "password123"
                            });

                            if (randError) {
                                throw new Error(`Could not authenticate: ${randError.message}`);
                            } else {
                                logSuccess(`Created and logged in as ${randomEmail}`);
                            }
                        } else {
                            logSuccess("Signed up successfully.");
                        }
                    }
                } else {
                    logSuccess("Logged in successfully.");
                }
            } else {
                logSuccess(`Using existing session (${sessionData.session.user.email}).`);
            }

            // 1. Get Category ID
            const { data: allCats, error: fetchCatsError } = await supabase.from("categories").select("id, name");
            if (fetchCatsError) {
                throw new Error(`Failed to fetch categories: ${fetchCatsError.message}`);
            }

            let categoryId;
            const sareeCat = allCats?.find((c: any) => c.name === "Sarees");

            if (sareeCat) {
                categoryId = sareeCat.id;
                logSuccess(`Found 'Sarees' category ID: ${categoryId}`);
            } else {
                log("Category 'Sarees' not found. Creating it...");
                const { data: newCat, error: catError } = await supabase
                    .from("categories")
                    .insert([{ name: "Sarees", slug: "sarees", description: "Traditional Sarees" }])
                    .select()
                    .single();

                if (catError) {
                    throw new Error("Failed to create category: " + catError.message);
                }
                categoryId = newCat.id;
                logSuccess(`Created 'Sarees' category ID: ${categoryId}`);
            }

            // 2. Insert Products
            for (const p of newProducts) {
                log(`Inserting ${p.name}...`);

                // Insert product
                const { data: productData, error: prodError } = await supabase
                    .from("products")
                    .insert([
                        {
                            name: p.name,
                            description: p.description,
                            price: p.price,
                            original_price: p.original_price,
                            stock_quantity: p.stock_quantity,
                            category_id: categoryId,
                            // fabric: p.fabric, 
                        },
                    ])
                    .select()
                    .single();

                if (prodError) {
                    if (prodError.message.includes("duplicate key")) {
                        log(`Product ${p.name} already exists. Skipping.`);
                        // Verify image?
                        continue;
                    }
                    logError(`Failed to insert ${p.name}: ${prodError.message}`);
                    continue;
                }

                const productId = productData.id;
                logSuccess(`Inserted product: ${p.name}`);

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
                    logError(`Failed to link image for ${p.name}: ${imgError.message}`);
                } else {
                    logSuccess(`Linked image for ${p.name}`);
                }
            }

            logSuccess("Seeding complete!");
        } catch (err: any) {
            logError(`Critical error: ${err.message}`);
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="container py-12 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Product Seeder</h1>
            <p className="text-muted-foreground mb-6">
                Click below to insert {newProducts.length} new saree products into the database.
            </p>

            <Button
                onClick={seedProducts}
                disabled={isSeeding}
                className="w-full mb-8"
            >
                {isSeeding ? "Seeding..." : "Start Seeding"}
            </Button>

            <div className="bg-muted p-4 rounded-lg font-mono text-xs space-y-1 h-96 overflow-y-auto">
                {status.length === 0 && <span className="text-muted-foreground">Ready...</span>}
                {status.map((s, i) => (
                    <div key={i}>{s}</div>
                ))}
            </div>
        </div>
    );
};

export default Seed;
