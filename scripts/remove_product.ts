import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://ddzgemgqhnwzdmklzlya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkemdlbWdxaG53emRta2x6bHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDU0MDIsImV4cCI6MjA4Njg4MTQwMn0.kuszGxw8EA0qBIxwna23GxPyF-bpTpQQbpkLSOKTrm4';
const supabase = createClient(supabaseUrl, supabaseKey);

const logStream = fs.createWriteStream('remove_output.txt', { flags: 'w' });
function log(msg: string) {
    console.log(msg);
    logStream.write(msg + '\n');
}

async function removeProduct(productName: string) {
    log(`Attempting to remove product: ${productName}`);

    try {
        // 1. Find the product
        const { data: products, error: findError } = await supabase
            .from('products')
            .select('id, name')
            .ilike('name', `%${productName}%`);

        if (findError) {
            log(`Error finding product: ${findError.message}`);
            return;
        }

        if (!products || products.length === 0) {
            log(`No product found matching: ${productName}`);
            return;
        }

        log(`Found ${products.length} matching products:`);
        for (const p of products) {
            log(` - [${p.id}] ${p.name}`);
        }

        // 2. Delete the products
        const idsToDelete = products.map(p => p.id);
        log(`Deleting product IDs: ${idsToDelete.join(', ')}...`);

        // First, handle product_images if they don't have ON DELETE CASCADE
        const { error: imgDeleteError } = await supabase
            .from('product_images')
            .delete()
            .in('product_id', idsToDelete);

        if (imgDeleteError) {
            log(`Warning/Error deleting images: ${imgDeleteError.message}`);
            // We continue anyway, maybe it's already empty or has cascade
        } else {
            log('Deleted associated images.');
        }

        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .in('id', idsToDelete);

        if (deleteError) {
            log(`Error deleting product: ${deleteError.message}`);
        } else {
            log(`Successfully removed ${products.length} product(s).`);
        }

    } catch (err: any) {
        log(`Critical error: ${err.message}`);
    }
}

removeProduct('Mysore Silk Saree').finally(() => {
    logStream.end();
    process.exit();
});
