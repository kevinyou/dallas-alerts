import axios from 'axios';
import { parse } from 'date-fns';

type ActiveIncidents = ActiveIncident[]
type ActiveIncident = {
    incident_number: string;
    division: string;
    // https://dallaspolice.net/about/Shared%20Documents/PoliceDivisions.pdf
    nature_of_call: string;
    priority: string;
    date: string;
    time: string;
    unit_number: string;
    block: string;
    location: string;
    beat: string;
    reporting_area: string;
    status: string;
}

export const getActiveIncidents = async (appToken: string) => {
    const url = `https://www.dallasopendata.com/resource/9fxf-t2tr.json?$$app_token=${appToken}`;
    try {
        const response = await axios.get<ActiveIncidents>(url);
        return response.data;
    } catch (error) {
        // https://dev.socrata.com/docs/response-codes.html
        throw error;
    }
}

const parseDateAndTime = (date: string, time: string): Date => {
    return parse(`${date.slice(0, 10)} ${time}`, `yyyy-MM-dd HH:mm:ss`, new Date());
}

const formatDateAndTime = (date: Date): string => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'America/Chicago',
        timeZoneName: 'short',
    })
    return formatter.format(date);
}

export enum IncidentMessageStyles {
    DallasPD,
    SeattlePD
}

export const formatIncidentMessage = (incident: ActiveIncident, style = IncidentMessageStyles.SeattlePD) => {
    switch (style) {
        case IncidentMessageStyles.DallasPD:
            return formatIncidentDallasStyle(incident);
        case IncidentMessageStyles.SeattlePD:
            return formatIncidentSeattleStyle(incident);
    }
}

// https://twitter.com/dpdincidents
const formatIncidentDallasStyle = (incident: ActiveIncident) => {
    const datetimeString = formatDateAndTime(parseDateAndTime(incident.date, incident.time));
    const address = incident.block ? `${incident.block} block ${incident.location}` : incident.location
    const message = `${incident.division} Division responding to '${incident.nature_of_call}' at ${address} | Beat ${incident.beat} | ${datetimeString}`
    return message;
}

const replaceBlockNumber = (blockNumber: string) => {
    const head = blockNumber.slice(0, blockNumber.length - 2);
    const tail = blockNumber.slice(blockNumber.length - 2);
    if (tail === '00') {
        return head + 'XX';
    }
    return blockNumber;
}

// https://twitter.com/SeattlePDD3
const formatIncidentSeattleStyle = (incident: ActiveIncident) => {
    const datetimeString = formatDateAndTime(parseDateAndTime(incident.date, incident.time));
    const address = incident.block ? `${replaceBlockNumber(incident.block)} block ${incident.location}` : incident.location
    const message = `${incident.division} Division, Beat: ${incident.beat}, ${incident.nature_of_call} at ${address.toLocaleUpperCase()} reported on ${datetimeString}, Incident# ${incident.incident_number}`
    return message;
}
