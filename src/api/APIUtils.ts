import { navigate } from '@reach/router';
import axios from 'axios';

export const TICKET_KEY = 'ticket';
export const TOKEN_KEY = 'token';
export const USER_KEY = 'userinfo';
export const PROJECT_KEY = 'project';

axios.defaults.baseURL = 'http://mp.bz.mgtv.com';
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        switch (error.response.status) {
            case 401:
                navigate('/register');
                break;
            case 404:
            case 403:
                navigate('/');
                break;
            default:
                navigate('/');
                break;
        }
        return Promise.reject(error.response);
    }
);
//将ticket放入请求头中
export function setTicket(ticket: string | null) {
    // if (ticket) {
    //     axios.defaults.headers.common['X-BLACKCAT-ticket'] = `${ticket}`;
    // } else {
    //     delete axios.defaults.headers.common['X-BLACKCAT-ticket'];
    // }
}

export default axios;
