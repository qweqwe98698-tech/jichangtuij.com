import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PLAN_FILE = path.resolve(__dirname, '../../../../data/content-plan.json')

export interface PlanEntry {
  id: string
  title: string
  url: string
  category: string
  primaryKeyword: string
  contentType: string
  intent: string
  pillar: string
  status: string
  summary: string
}

declare const data: { entries: PlanEntry[]; byCategory: Record<string, PlanEntry[]> }
export { data }

export default {
  watch: [PLAN_FILE],
  load(): { entries: PlanEntry[]; byCategory: Record<string, PlanEntry[]> } {
    if (!fs.existsSync(PLAN_FILE)) return { entries: [], byCategory: {} }
    const raw = JSON.parse(fs.readFileSync(PLAN_FILE, 'utf-8'))
    const entries: PlanEntry[] = Array.isArray(raw.entries) ? raw.entries : []
    const byCategory: Record<string, PlanEntry[]> = {}
    for (const e of entries) {
      ;(byCategory[e.category] ||= []).push(e)
    }
    return { entries, byCategory }
  }
}
