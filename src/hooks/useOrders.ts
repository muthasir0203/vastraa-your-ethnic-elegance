import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useOrder = (orderId: string) => {
    return useQuery({
        queryKey: ['order', orderId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*, product:products(*)), addresses(*)')
                .eq('id', orderId)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!orderId,
    });
};

export const useOrders = () => {
    const queryClient = useQueryClient();

    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*, product:products(*))')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    const createOrder = useMutation({
        mutationFn: async (orderData: {
            total_price: number;
            payment_method: string;
            shipping_address_id: string;
            items: { product_id: string; quantity: number; price: number }[];
        }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Authentication required');

            // 1. Create order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    user_id: user.id,
                    total_price: orderData.total_price,
                    payment_method: orderData.payment_method,
                    shipping_address_id: orderData.shipping_address_id,
                    status: 'placed'
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create order items
            const orderItems = orderData.items.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price_at_purchase: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Clear cart
            await supabase.from('cart_items').delete().eq('user_id', user.id);

            return order;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    return { orders, isLoading, createOrder };
};
