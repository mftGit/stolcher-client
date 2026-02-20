'use strict'

const URL_TEMPLATE = 'https://monitoring<number>.mftitalia.it';
const MONITORING_SERVICES = [
    {name: 'Atlantis', number: 1},
    {name: 'EasyCast', number: 2}
];

/**
 * Restituisce un array con la lista di tutti i servizi.
 *
 * @returns {Array} array con la lista dei servizi
 */
async function getServicesList(version) {
    if (version !== 1) {
        throw new Error('Unsupported version: ' + version);
    }

    return await iterateOverServices(async (baseUrl) => {
        let url = baseUrl + `/api/monitoredServices`;

        try {
            return await (await fetch(url)).json();
        } catch (e) {
            console.log('Error while fetching services from ' + url + ': ' + e);
            return [];
        }
    });
}

/**
 * Restituisce un array con lo stato di tutti i servizi.
 *
 * @param {number} version - numero di versione
 * @param {string} [serviceName] - opzionale, se specificato restituisce solo lo stato del servizio con quel nome
 * @returns {Array} array con lo stato dei servizi
 */
async function getServicesStatus(version, serviceName) {
    if (version !== 1) {
        throw new Error('Unsupported version: ' + version);
    }

    return await iterateOverServices(async (baseUrl) => {
        let url = baseUrl + `/api/monitoredServices/status`;
        if (serviceName) {
            url += `?serviceName=${serviceName}`;
        }
        try {
            return await (await fetch(url)).json();
        } catch (e) {
            console.log('Error while fetching status from ' + url + ': ' + e);
            return [];
        }
    });
}

/**
 * Restituisce un array con la lista dei master/slave
 *
 * @returns {Array} array con la lista dei servizi
 */
async function getOnlineMastersAndSlaves(version) {
    if (version !== 1) {
        throw new Error('Unsupported version: ' + version);
    }

    const mastersAndSlaves = [];
    await iterateOverServices(async (baseUrl, serviceName, n) => {
        let url = baseUrl + `/api/monitoredServices`;
        const monitoringName = `Monitoring ${n} - ${serviceName}`;
        try {
            await (await fetch(url)).json();
            mastersAndSlaves.push({
                monitoringName: monitoringName,
                monitoringUrl: baseUrl,
                status: 'ONLINE'
            });
        } catch (e) {
            mastersAndSlaves.push({
                monitoringName: monitoringName,
                monitoringUrl: baseUrl,
                status: 'OFFLINE'
            });
            throw e;
        }
    }, true);

    return mastersAndSlaves;
}

async function iterateOverServices(callback, iterateAll = false) {
    for (const {name, number} of MONITORING_SERVICES) {
        const url = URL_TEMPLATE.replace('<number>', number.toString());
        try {
            const result = await callback(url, name, number);
            if (!iterateAll)
                return result;
        } catch (e) {
            console.log('Error while calling monitoring service ' + url + ': ' + e);
        }
    }
    return null;
}


// Export (Node) + expose (Browser)
const api = {
    getServicesList,
    getServicesStatus,
    iterateOverServices,
    getOnlineMastersAndSlaves
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
}

if (typeof window !== 'undefined') {
    window.stolcherClient = api;
}