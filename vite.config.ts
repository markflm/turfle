import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        hmr: {},
    },
    build: {
        manifest: true,
        rollupOptions: {
            external: [
                'src/utils/insert-data.ts',
                'src/utils/sleeperdata.json',
            ],
        },
    },
})
