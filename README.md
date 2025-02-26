# dallas-alerts

## About
This bot retrieves active police incidents from [dallasopendata](https://www.dallasopendata.com/Public-Safety/Dallas-Police-Active-Calls/9fxf-t2tr) and posts all active incidents to a Bluesky account.

### Hosting
Alerts available at [@dallas-alerts.bsky.social](https://bsky.app/profile/dallas-alerts.bsky.social).

This bot runs on [AWS Lambda](https://aws.amazon.com/lambda/) every 2 minutes.

Redis instance hosted by [Redis Enterprise](https://redis.com/redis-enterprise-cloud/overview/).

### Deduplication
Making a request to Blueky for a duplicate incident is deduplicated by using a Redis cache.

## Development
To get OpenData secrets, see [Socrata: Generating an App Token](https://support.socrata.com/hc/en-us/articles/210138558-Generating-an-App-Token).

Run Redis locally at `localhost:6379`, or provide remote Redis location via the `REDIS_(URL|USERNAME|PASSWORD)` environment variables.

```sh
nvm use
npm install
npm run build
DALLAS_ALERTS_OPENDATA_TOKEN=${your_opendata_token} \
  DALLAS_ALERTS_BLUESKY_IDENTIFIER=${your_bluesky_identifier} \
  DALLAS_ALERTS_BLUESKY_PASSWORD=${your_bluesky_password} \
  npm run start
```

## Building and Packaging for AWS Lambda
```sh
./create_zip.sh
```
Then upload to aWS Lambda manually
Not the most automated way: