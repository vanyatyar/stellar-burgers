import { defineConfig } from 'cypress';
export default defineConfig({
e2e: {
baseUrl: 'http://localhost:8083',
viewportWidth: 1280,
viewportHeight: 720,
setupNodeEvents(on, config) {
},
},
component: {
devServer: {
framework: 'react',
bundler: 'vite',
},
},
});
/// <reference types="cypress" />
