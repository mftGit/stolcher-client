export {};

export interface MasterSlaveStatus {
    monitoringName: string;
    monitoringUrl: string;
    status: 'ONLINE' | 'OFFLINE';
}

export interface ServiceStatus {
    lastCheckedAt: string; // ISO date-time
    monitoredServiceName: string;
    status: 'ONLINE' | 'OFFLINE' | 'WARNING';
    statusMessage?: string;
}

export interface MonitoredService {
    monitoredServiceName: string;
    activeMonitoring: boolean;
}

declare global {

    interface Window {
        stolcherClient: {
            getServicesList(version: number): Promise<MonitoredService[]>;
            getServicesStatus(version: number, serviceName?: string): Promise<ServiceStatus[]>;
            getOnlineMastersAndSlaves(version: number): Promise<MasterSlaveStatus[]>;
            iterateOverServices<T>(callback: (baseUrl: string) => Promise<T>): Promise<T | null>;
        };
    }
}
