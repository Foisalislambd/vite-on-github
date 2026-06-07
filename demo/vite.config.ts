import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteBasepath from 'vite-basepath';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), viteBasepath(), tailwindcss()],
});
