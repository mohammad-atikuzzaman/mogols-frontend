import { Suspense } from 'react';
import LoginForm from "../../../components/auth/LoginForm";

function LoginFormWrapper({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <LoginFormWithParams searchParams={searchParams} />
        </Suspense>
    );
}

async function LoginFormWithParams({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
    const params = await searchParams;
    const redirectUrl = params.redirect || '/';
    return <LoginForm redirectUrl={redirectUrl} />;
}

export default async function Login({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 py-12 lg:px-8 font-sans">
            <LoginFormWrapper searchParams={searchParams} />
        </div>
    );
}
