'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useEffect } from 'react';
import { hydrateCart } from '../store/cartSlice';
import { setCredentials } from '../store/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Hydrate Cart
        const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')!) : [];
        const shippingAddress = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')!) : {};
        const paymentMethod = localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')!) : 'COD';

        store.dispatch(hydrateCart({
            cartItems,
            shippingAddress,
            paymentMethod
        }));

        // Hydrate User
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
        if (user) {
            store.dispatch(setCredentials(user));
        }
    }, []);

    return <Provider store={store}>{children}</Provider>;
}
