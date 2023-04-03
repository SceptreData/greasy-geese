import { defineConfig } from 'astro/config'
import compress from 'astro-compress'
import GeeseStats from './src/integrations/GeeseStats'

// https://astro.build/config
export default defineConfig({
  sheetData: 'foo',
  integrations: [
    compress({
      html: { conservativeCollapse: true },
    }),
    GeeseStats(),
  ],
})
