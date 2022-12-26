import axios from 'axios';

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

// https://twitter.com/dpdincidents
export const formatIncidentMessage = (incident: ActiveIncident) => {
    // const formatter = new Intl.DateTimeFormat('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
    // const date = formatter.format(new Date(incident.date));
    const message = `${incident.division} Division responding to '${incident.nature_of_call}' at ${incident.block} blk ${incident.location} | Beat ${incident.beat} | ${incident.time}`
    return message;
}
