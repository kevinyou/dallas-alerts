import { formatIncidentMessage, getActiveIncidents } from './dallasPDData';
import { publishStatus } from './mastodonApiClient';

// TODO: Use a library like `envalid` for environment variable type safety, instead of casting to string

const main = async () => {
    const incidents = await getActiveIncidents(process.env.DALLAS_ALERTS_OPENDATA_TOKEN as string);
    for (let incident of incidents) {
        const message = formatIncidentMessage(incident);
        await publishStatus(process.env.DALLAS_ALERTS_MASTODON_TOKEN as string, message, incident.incident_number);
    }
};

main();

