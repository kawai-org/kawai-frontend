import Logo from '@/assets/logo.png';

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <img
                    src={Logo}
                    alt="Loading..."
                    className="w-24 h-24 relative z-10 animate-bounce-slow"
                    style={{ animationDuration: '2s' }}
                />
            </div>
            <h2 className="mt-8 text-xl font-bold text-primary animate-pulse">
                Kawai-chan is thinking...
            </h2>
        </div>
    );
}

// Add this to index.css if needed, or rely on Tailwind utility hacks
// .animate-bounce-slow { animation: bounce 3s infinite; }
