import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as addToCartApi, increaseQuantity, decreaseQuantity, removeFromCart as removeFromCartApi, clearCart as clearCartApi } from '../api/cartApi';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0 });
    const [loading, setLoading] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const fetchCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        try {
            setLoading(true);
            const response = await getCart();
            if (response.success) {
                setCart(response.data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addItemToCart = async (productData) => {
        try {
            const response = await addToCartApi(productData);
            if (response.success) {
                setCart(response.data);
                toast.success("Item added to cart!");
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add item");
            return false;
        }
    };

    const updateItemQuantity = async (productId, selectedSize, type) => {
        try {
            const response = type === 'increase' 
                ? await increaseQuantity(productId, selectedSize)
                : await decreaseQuantity(productId, selectedSize);
            
            if (response.success) {
                setCart(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity");
        }
    };

    const removeItemFromCart = async (productId, selectedSize) => {
        try {
            const response = await removeFromCartApi(productId, selectedSize);
            if (response.success) {
                setCart(response.data);
                toast.success("Item removed from cart");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item");
        }
    };

    const clearUserCart = async () => {
        try {
            const response = await clearCartApi();
            if (response.success) {
                setCart({ items: [], totalItems: 0, totalAmount: 0 });
                toast.success("Cart cleared");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to clear cart");
        }
    };

    return (
        <CartContext.Provider 
            value={{ 
                cart, 
                loading, 
                fetchCart, 
                addItemToCart, 
                updateItemQuantity, 
                removeItemFromCart, 
                clearUserCart,
                isCartOpen,
                setIsCartOpen 
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
