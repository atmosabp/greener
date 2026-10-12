export interface ServiceTypes{
    id?: string,
    name?: string,
    location?: {
      region_code?: string,
      country?: string,
      region?: string,
      city?: string,
      latitude?: number,
      longitude?: number
    },
    metrics_path?: string
    status : ServiceStatus | undefined
}

export type ServiceStatus = "disponível"|"indisponível"|"incompleta"