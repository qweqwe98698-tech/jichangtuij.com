import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GLOSSARY_FILE = path.resolve(__dirname, '../../../../data/glossary.json')

export interface GlossaryTerm {
  id: string
  term: string
  en: string
  category: string
  definition: string
  detail: string
  related: string[]
}

declare const data: { terms: GlossaryTerm[]; categories: string[] }
export { data }

export default {
  watch: [GLOSSARY_FILE],
  load(): { terms: GlossaryTerm[]; categories: string[] } {
    const terms: GlossaryTerm[] = JSON.parse(fs.readFileSync(GLOSSARY_FILE, 'utf-8'))
    const categories: string[] = []
    for (const t of terms) if (!categories.includes(t.category)) categories.push(t.category)
    return { terms, categories }
  }
}
