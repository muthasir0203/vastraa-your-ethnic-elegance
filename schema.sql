-- SQL Schema for Vastraa E-commerce
-- Run this in the Supabase SQL Editor (SQL Editor > New Query)

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Addresses Table
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    phone TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    shipping_address_id UUID REFERENCES addresses(id),
    status TEXT DEFAULT 'placed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

-- 7. Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Allow PUBLIC READ access for categories, products, and images
CREATE POLICY "Allow public read on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read on product_images" ON product_images FOR SELECT USING (true);

-- User-specific policies (Requires Authentication)
CREATE POLICY "Users can manage their own addresses" ON addresses 
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders" ON orders 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own order items" ON order_items 
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    ));

CREATE POLICY "Users can manage their own cart" ON cart_items 
    FOR ALL USING (auth.uid() = user_id);

-- STORAGE BUCKET CONFIGURATION
-- 1. Create a bucket named 'products' in the Supabase Dashboard (Storage > New Bucket)
-- 2. Run these policies to allow public access to images and authenticated uploads

-- Allow public access to read images
-- (Note: 'products' is the bucket name)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');

-- Allow authenticated users (admins) to upload images
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete/update images
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND auth.role() = 'authenticated');
