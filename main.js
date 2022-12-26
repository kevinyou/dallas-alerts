const { readFile } = require('fs/promises');
const axios = require('axios');

const SECRET_PATH = './dallas_opendata_token';

const getData = async (appToken) => {
    const url = `https://www.dallasopendata.com/resource/9fxf-t2tr.json?$$app_token=${appToken}`;
    const response = await axios.get(url);
    return response.data;
}

const main = async () => {
    const appToken = await readFile(SECRET_PATH, 'utf8');
    const data = await getData(appToken);
    console.log(data.slice(0, 2));
};

main();

