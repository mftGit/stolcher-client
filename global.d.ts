export {};

interface MasterSlaveStatus {
    monitoring: string;
    status: 'ONLINE' | 'OFFLINE';
}

interface ServiceStatus {
    lastCheckedAt: string; // ISO date-time
    monitoredServiceName: string;
    status: 'ONLINE' | 'OFFLINE' | 'WARNING';
    statusMessage?: string;
}

interface MonitoredService {
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
