import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useProducts = (categorySlug?: string) => {
    return useQuery({
        queryKey: ['products', categorySlug],
        queryFn: async () => {
            let query = supabase
                .from('products')
                .select(`
          *,
          category:categories(name, slug),
          product_images(url, is_primary)
        `);

            if (categorySlug) {
                // Since category info is joined, we filter by the related category's slug
                query = query.eq('categories.slug', categorySlug);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Transform data to match frontend expectations if necessary
            return data.map((p: any) => ({
                ...p,
                image: p.product_images?.find((img: any) => img.is_primary)?.url || p.product_images?.[0]?.url,
                category: p.category?.name
            }));
        },
    });
};

export const useProduct = (id: string) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          category:categories(name, slug),
          product_images(url, is_primary)
        `)
                .eq('id', id)
                .single();

            if (error) throw error;

            return {
                ...data,
                image: data.product_images?.find((img: any) => img.is_primary)?.url || data.product_images?.[0]?.url,
                category: data.category?.name
            };
        },
        enabled: !!id,
    });
};
