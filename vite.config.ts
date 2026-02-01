import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import arraybuffer from 'vite-plugin-arraybuffer';
import additionalModules from '@cf-wasm/plugins/vite-additional-modules';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), arraybuffer(), additionalModules({ target: 'edge-light' })],
	ssr: {
		noExternal: [/@cf-wasm\/.*/]
	}
});
