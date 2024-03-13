/** @type {import('tailwindcss').Config} */
export default {
    content: ['**/*.{html,tsx}'],
    theme: {
        screens: {
            mobile: { min: '0px', max: '899px' },
            tablet: '900px',
            // => @media (min-width: 640px) { ... }

            laptop: '1024px',
            // => @media (min-width: 1024px) { ... }

            desktop: '1280px',
            // => @media (min-width: 1280px) { ... }
        },
        extend: {},
    },
    plugins: [],
}
