'use strict'

const URL_TEMPLATE = 'https://monitoring<number>.mftitalia.it';
const START_NUMBER = 1;
const END_NUMBER = 10;


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
    await iterateOverServices(async (baseUrl) => {
        let url = baseUrl + `/api/monitoredServices`;
        await (await fetch(url)).json();
        mastersAndSlaves.push({
            monitoring: url,
            online: true
        });
    });

    return mastersAndSlaves;
}

async function iterateOverServices(callback) {
    for (let i = START_NUMBER; i <= END_NUMBER; i++) {
        const url = URL_TEMPLATE.replace('<number>', i.toString());
        try {
            return await callback(url);
        } catch (e) {
            if (typeof e?.message === 'string' && e.message.includes('Failed to fetch')) {
                console.log('Domain not resolved for ' + url);
                return null;
            } else {
                console.log('Error while calling monitoring service ' + url + ': ' + e);
            }
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