import { formatIncidentMessage, getActiveIncidents } from './dallasPDData';
import { publishStatus } from './mastodonApiClient';
import bluebird from 'bluebird';

// TODO: Use a library like `envalid` for environment variable type safety, instead of casting to string

export const main = async () => {
    const incidents = await getActiveIncidents(process.env.DALLAS_ALERTS_OPENDATA_TOKEN as string);
    let numPublished = 0;

    await bluebird.map(incidents, async (incident) => {
        const message = formatIncidentMessage(incident);
        try {
            await publishStatus(process.env.DALLAS_ALERTS_MASTODON_TOKEN as string, message, incident.incident_number);
            console.log(`Successfully published incident ${incident.incident_number}`);
            numPublished++;

        } catch (e) {
            console.error(`Failed to publish incident ${incident.incident_number}`);
        }
    }, { concurrency: 5 })

    return {
        totalIncidents: incidents.length,
        numPublished
    }
};

if (require.main === module) {
    main();
}
