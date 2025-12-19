'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/`;

export async function loginUser(prevState: any, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch(`${API_ENDPOINT}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { message: data.message || 'Login failed', success: false };
        }

        // Set persistent cookie with the token
        const cookieStore = await cookies();
        const isProduction = process.env.NODE_ENV === 'production';

        cookieStore.set('token', data.token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });

        // We will return success and user data, and the client component (LoginForm) will handle localStorage set (via useEffect) 
        // OR simply redirect. Since useActionState is used, we might want to just redirect here?
        // But the user wants seamless experience. 
        // Actually, for Server Actions, we can just redirect. The client side token persistence is tricky with server actions only 
        // if we don't have a client component to catch the state.
        // Let's assume the LoginForm will handle state update if we return, BUT we also want to redirect.
        // A common pattern: if success, redirect.

        // HOWEVER, to fix the specific issue "checkout page redirects to login even if logged in", 
        // it means the client side logic (productService/orderService) likely checks localStorage or doesn't have the cookie in browser context yet?
        // Actually, with httpOnly cookie, client JS cannot read it. 
        // So services MUST rely on the browser sending the cookie automatically (which we enabled with withCredentials: true).
        // The issue "add product page not found" and "checkout redirecting" suggests state mismatch.

        // Let's return the user data so the client form can save it to localStorage for UI state (like "Welcome User")
        // But we cannot redirect AND return a value easily in server actions unless we use a specific pattern.
        // Let's stick to redirecting for now, as that's standard for login.
        // If we want to set localStorage, we needs a client side effect.

    } catch (error: any) {
        return { message: error.message || 'Something went wrong', success: false };
    }

    const redirectPath = formData.get('redirect') as string || '/';
    redirect(redirectPath);
}

export async function registerUser(prevState: any, formData: FormData) {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
        const response = await fetch(`${API_ENDPOINT}register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { message: data.message || 'Registration failed', success: false };
        }

        const cookieStore = await cookies();
        const isProduction = process.env.NODE_ENV === 'production';

        cookieStore.set('token', data.token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        });

    } catch (error: any) {
        return { message: error.message || 'Something went wrong', success: false };
    }

    redirect('/');
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    redirect('/login');
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) return null;

    try {
        const response = await fetch(`${API_ENDPOINT}me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
            // Ensure we don't cache this too aggressively
            cache: 'no-store',
        });

        if (!response.ok) return null;

        return await response.json();
    } catch (error) {
        return null;
    }
}
