import providersRaw from '../../../../data/providers.json'

export interface ProviderInfo {
  id: string
  name: string
  slug: string
  site: string
  status: string
  firstSeen: string
  lastVerified: string
  notes: string
  entryPrice?: string
  traffic?: string
}

export default {
  load() {
    return {
      hasData: providersRaw.length > 0,
      providers: providersRaw as ProviderInfo[]
    }
  }
}
