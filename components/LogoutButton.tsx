'use client';

import { logoutUser } from "../app/actions/auth";

export default function LogoutButton() {
    return (
        <button
            onClick={() => logoutUser()}
            className="rounded-full bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
        >
            Logout
        </button>
    );
}
