import { formatBeatTag, formatDivisionTag, formatIncidentMessage, getActiveIncidents } from './dallasPDData';
import { cleanEnv, str, url } from 'envalid';
import { createClient } from 'redis';
import { BskyAgent } from '@atproto/api'

const CACHE_EXPIRATION_SECONDS = 60 * 15; // 15 minutes
// TODO: Use a library like `envalid` for environment variable type safety, instead of casting to string

export const main = async () => {
    const env = cleanEnv(process.env, {
        DALLAS_ALERTS_OPENDATA_TOKEN: str(),
        // DALLAS_ALERTS_MASTODON_TOKEN: str(),
        DALLAS_ALERTS_BLUESKY_IDENTIFIER: str(),
        DALLAS_ALERTS_BLUESKY_PASSWORD: str(),
        REDIS_URL: url({
            default: 'redis://localhost:6379'
        }),
        REDIS_USERNAME: str({
            default: undefined
        }),
        REDIS_PASSWORD: str({
            default: undefined
        }),
    });

    const client = createClient({
        url: env.REDIS_URL,
        username: env.REDIS_USERNAME,
        password: env.REDIS_PASSWORD,
    });

    const agent = new BskyAgent({
        service: 'https://bsky.social'
    })
    await agent.login({
        identifier: env.DALLAS_ALERTS_BLUESKY_IDENTIFIER,
        password: env.DALLAS_ALERTS_BLUESKY_PASSWORD,
    })


    const incidents = await getActiveIncidents(env.DALLAS_ALERTS_OPENDATA_TOKEN);
    let numPublished = 0;

    await client.connect();
    try {
        for (let incident of incidents) {
            const exists = await client.exists(incident.incident_number);
            if (exists) {
                console.log(`Skipping already published incident ${incident.incident_number}`);
                continue;
            }

            const message = formatIncidentMessage(incident);
            try {
                await agent.post({
                    text: message,
                    createdAt: new Date().toISOString(),
                    tags: [formatDivisionTag(incident), formatBeatTag(incident)],
                });
                console.log(`Successfully published incident ${incident.incident_number}`);
                numPublished++;

            } catch (e) {
                console.error(`Failed to publish incident ${incident.incident_number}`);
            }
        }

        for (let incident of incidents) {
            await client.setEx(incident.incident_number, CACHE_EXPIRATION_SECONDS, '1');
        }

    } finally {
        await client.disconnect();
    }


    return {
        totalIncidents: incidents.length,
        numPublished
    }
};

if (require.main === module) {
    main();
}
