import axios from 'axios';
import FormData from 'form-data';

const ROOT_URL = 'https://botsin.space/api';

// https://docs.joinmastodon.org/methods/statuses/#create
export const publishStatus = async (token: string, statusContent: string, incidentNumber: string) => {
    const url = `${ROOT_URL}/v1/statuses`;
    const data = new FormData();
    data.append('status', statusContent)

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Idempotency-Key': incidentNumber,
                'Content-Type': 'multipart/form-data',
            }
        });
        return response;
    } catch (error) {
        throw error;
    }

}

// https://docs.joinmastodon.org/methods/timelines/#home
export const getHomeTimeline = async (token: string) => {
    const url = `${ROOT_URL}/v1/timelines/home`;
    try {
        const response = await axios.get<{ url: string }[]>(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }

}

export const getPublicTimeline = async () => {
    const url = 'https://botsin.space/api/v1/timelines/public?limit=2';
    try {
        const response = await axios.get<{ url: string }[]>(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}