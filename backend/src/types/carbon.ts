export interface ApiCarbon {
    region_code: string
    country?: string
    region?: string
    city?: string
    carbon_intensity_gco2e_per_kwh?: number
    renewable_share_percent?: number
}
