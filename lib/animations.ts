import { easeInOut, easeOut } from "framer-motion";

export const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.2,
        },
    },
};

export const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: easeOut } },
};

export const floatY = (
  y: number = 10,
  duration: number = 5
) => ({
  animate: {
    y: [0, -y, 0],
  },
  transition: {
    duration,
    repeat: Infinity,
    ease: easeInOut,
  },
});