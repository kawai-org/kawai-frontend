import { useEffect, useState } from 'react';
import { Monitor } from 'lucide-react';
import Logo from '@/assets/logo.png';

export default function MobileGuard({ children }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            // Standard tablet breakpoint is 768px.
            // Requirement mentions "Desktop Only", so strict check < 1024px or < 768px.
            // Let's use 768px to allow tablets in landscape, or strict desktop < 1024.
            // User said "platform mobile", typically < 768px.
            setIsMobile(window.innerWidth < 768);
        };

        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 mb-6 relative">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                    <img src={Logo} alt="Kawai Logo" className="w-full h-full object-contain relative z-10" />
                </div>

                <h1 className="text-2xl font-bold text-primary mb-4">Desktop Only!</h1>
                <p className="text-muted-foreground max-w-xs mx-auto mb-8 leading-relaxed">
                    Kawai-chan currently only works on desktop to ensure the best experience. Please open this website on your PC or Laptop.
                </p>

                <div className="p-4 bg-secondary/30 rounded-2xl flex items-center gap-3 text-sm font-medium text-foreground/80">
                    <Monitor size={24} className="text-primary" />
                    <span>Please switch to Desktop</span>
                </div>
            </div>
        );
    }

    return children;
}
