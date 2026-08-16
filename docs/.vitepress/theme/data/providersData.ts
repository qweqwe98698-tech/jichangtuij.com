import providersDataRaw from '../../../../data/providers.json'

export interface ProviderItem {
  id: string
  slug: string
  name: string
  status: string
  firstSeen: string
  lastVerified: string
  lastMeasured: string | null
  site: string
  couponCode?: string
  established?: string
  entryPrice: string
  isAnnualDiscount: boolean
  traffic: string
  protocols: string[]
  routes: string[]
  positioning: string
  notes: string
  aiSupported?: string
  streamingSupported?: string
}

export const providersData: ProviderItem[] = providersDataRaw as ProviderItem[]
