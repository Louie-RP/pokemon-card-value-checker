// Global ambient module declarations for style-only imports.
// This prevents TS2307 errors when importing CSS from libraries like Swiper.
declare module 'swiper/css';

// Generic fallback for any direct CSS imports if needed.
declare module '*.css';
