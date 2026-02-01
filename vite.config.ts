import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import arraybuffer from 'vite-plugin-arraybuffer';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), arraybuffer()],
	external: ['@cloudflare/pages-plugin-vercel-og']
});
