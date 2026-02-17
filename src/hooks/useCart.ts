import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useCart = () => {
    const queryClient = useQueryClient();

    const { data: cartItems, isLoading } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('cart_items')
                .select('*, product:products(*, product_images(url))')
                .eq('user_id', user.id);

            if (error) throw error;
            return data;
        },
    });

    const addToCart = useMutation({
        mutationFn: async (item: { product_id: string; quantity: number; size?: string; color?: string }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Authentication required');

            const { data, error } = await supabase
                .from('cart_items')
                .insert([{ ...item, user_id: user.id }])
                .select();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const updateQuantity = useMutation({
        mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
            const { data, error } = await supabase
                .from('cart_items')
                .update({ quantity })
                .eq('id', id);

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const removeItem = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    return { cartItems, isLoading, addToCart, updateQuantity, removeItem };
};
