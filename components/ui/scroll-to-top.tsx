"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "./button";

export const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const isVisibleRef = useRef(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        let raf = 0;
        const toggleVisibility = () => {
            raf = 0;
            const nextVisible = window.scrollY > 300;
            if (nextVisible !== isVisibleRef.current) {
                isVisibleRef.current = nextVisible;
                setIsVisible(nextVisible);
            }
        };
        const scheduleToggle = () => {
            if (!raf) raf = window.requestAnimationFrame(toggleVisibility);
        };

        toggleVisibility();
        window.addEventListener("scroll", scheduleToggle, { passive: true });
        return () => {
            if (raf) window.cancelAnimationFrame(raf);
            window.removeEventListener("scroll", scheduleToggle);
        };
    }, []);

    return (
        <div className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 transition-all duration-500 ease-in-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>
            <Button
                onClick={scrollToTop}
                size="icon"
                className="
                    rounded-full w-12 h-12
                    bg-primary backdrop-blur-md 
                    btn-inner-shadow text-white 
                    hover:scale-110 transition-all duration-300
                    hover:bg-purple-600/90 group
                "
                aria-label="Scroll to top"
            >
                <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
            </Button>
        </div>
    );
};