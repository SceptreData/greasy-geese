import fs from 'fs/promises'
import type { AstroIntegration } from 'astro'

async function BuildGeeseStats() {}

export default function GeeseStatsIntegration(): AstroIntegration {
  const GeeseStats = { name: 'geesey' }
  const outFile = './src/GeeseStats.json'

  return {
    name: 'GeeseStats',
    hooks: {
      'astro:config:setup': async () => {
        await fs.writeFile(outFile, JSON.stringify(GeeseStats))
      },
    },
  }
}
