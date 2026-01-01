import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    _id: string;
    name: string;
    image: string;
    price: number;
    countInStock: number;
    qty: number;
}

export interface ShippingAddress {
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
}

interface CartState {
    cartItems: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
}

const initialState: CartState = {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: 'COD',
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x) =>
                    x._id === existItem._id ? item : x
                );
            } else {
                state.cartItems = [...state.cartItems, item];
            }

            if (typeof window !== 'undefined') {
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
            if (typeof window !== 'undefined') {
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            }
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
            }
        },
        savePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
            if (typeof window !== 'undefined') {
                localStorage.removeItem('cartItems');
            }
        },
        hydrateCart: (state, action: PayloadAction<CartState>) => {
            state.cartItems = action.payload.cartItems;
            state.shippingAddress = action.payload.shippingAddress;
            state.paymentMethod = action.payload.paymentMethod;
        }
    },
});

export const { addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCart, hydrateCart } = cartSlice.actions;

export default cartSlice.reducer;
