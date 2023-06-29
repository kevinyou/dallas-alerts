# dallas-alerts

## About
This bot retrieves active police incidents from [dallasopendata](https://www.dallasopendata.com/Public-Safety/Dallas-Police-Active-Calls/9fxf-t2tr) and posts all active incidents to a Mastodon instance.

### Hosting
Alerts available at [@unofficial_dpdincidents@botsin.space](https://botsin.space/@unofficial_dpdincidents).

This bot runs on [AWS Lambda](https://aws.amazon.com/lambda/) every 2 minutes.

Redis instance hosted by [Redis Enterprise](https://redis.com/redis-enterprise-cloud/overview/).

### Deduplication
Making a request to Mastodon for a duplicate incident is deduplicated first to by using a Redis cache, and then duplicate requests to Mastodon are deduplicated via Mastodon's [Idempotency-Key header](https://docs.joinmastodon.org/methods/statuses/#headers).

## Development
To get OpenData secrets, see [Socrata: Generating an App Token](https://support.socrata.com/hc/en-us/articles/210138558-Generating-an-App-Token).

To get Mastodon secrets, log in to your Mastodon account and go to Settings -> Development.

Run Redis locally at `localhost:6379`, or provide remote Redis location via the `REDIS_(URL|USERNAME|PASSWORD)` environment variables.

```
nvm use
npm install
npm run build
DALLAS_ALERTS_OPENDATA_TOKEN=${your_opendata_token} \
  DALLAS_ALERTS_MASTODON_TOKEN=${your_mastodon_token} \
  npm run start
```

## Building and Packaging for AWS Lambda
Not the most automated way:
```
rm -rf function
npm run build
cp -R dist function
cp package.json function/package.json
cd function
npm install --omit=dev
zip -r function.zip .
```
