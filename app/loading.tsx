export default function Loading() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
            <div className="text-center">
                {/* Animated Logo */}
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl animate-pulse">
                            <span className="text-white font-bold text-3xl">M</span>
                        </div>
                        {/* Spinning ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin"></div>
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    Loading...
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Please wait while we prepare your content
                </p>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mt-6">
                    <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
