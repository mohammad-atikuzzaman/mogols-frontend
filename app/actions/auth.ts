'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_ENDPOINT = `${process.env.API_URL}/api/auth/`;

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

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });

        // Store user info in a separate cookie if needed for client ease, 
        // but typically we verify token. For now, let's just stick to token.
        // We can't return a redirect here inside a try/catch easily if we want to pass state,
        // but typically we redirect on success.
    } catch (error: any) {
        return { message: error.message || 'Something went wrong', success: false };
    }

    redirect('/');
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
        cookieStore.set('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
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
