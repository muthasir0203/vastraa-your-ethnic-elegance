import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useWishlist = () => {
    const queryClient = useQueryClient();

    const { data: wishlistItems, isLoading } = useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('wishlist')
                .select('*, product:products(*, product_images(url))')
                .eq('user_id', user.id);

            if (error) throw error;
            return data;
        },
    });

    const toggleWishlist = useMutation({
        mutationFn: async (productId: string) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Authentication required');

            // Check if already in wishlist
            const { data: existing } = await supabase
                .from('wishlist')
                .select('id')
                .eq('user_id', user.id)
                .eq('product_id', productId)
                .single();

            if (existing) {
                const { error } = await supabase
                    .from('wishlist')
                    .delete()
                    .eq('id', existing.id);
                if (error) throw error;
                return { type: 'removed' };
            } else {
                const { error } = await supabase
                    .from('wishlist')
                    .insert([{ user_id: user.id, product_id: productId }]);
                if (error) throw error;
                return { type: 'added' };
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    return { wishlistItems, isLoading, toggleWishlist };
};
