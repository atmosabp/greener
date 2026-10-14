export interface MetricsData {
    cpu_percent?: number
    memory_gb?: number
    disk_gb?: number
    network_gb?: number
}

export interface MetricsTypes {
    collection_interval_seconds: number
    metrics?: MetricsData
}
