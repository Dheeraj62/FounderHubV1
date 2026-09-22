import { environment } from '../../../environments/environment';

function getHubUrl(apiUrl: string): string {
    if (!apiUrl) return '';
    if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
        return new URL(apiUrl).origin;
    }
    return apiUrl.replace(/\/api(\/v\d+)?\/?$/, '');
}

export const API_CONFIG = {
    baseUrl: environment.apiUrl,
    hubUrl: getHubUrl(environment.apiUrl)
};
