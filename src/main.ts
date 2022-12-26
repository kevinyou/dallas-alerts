import axios from 'axios';
import { readFile } from 'fs/promises';
import { formatIncidentMessage, getActiveIncidents } from './dallasPDData';

const SECRET_PATH = './dallas_opendata_token';

const main = async () => {
    const appToken = await readFile(SECRET_PATH, 'utf8');
    const data = await getActiveIncidents(appToken);
    const messages = data.map(incident => formatIncidentMessage(incident))
    messages.forEach(x => console.log(x));
};

main();

