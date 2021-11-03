import axios from 'axios';
import {config} from './config';
const requestClient = axios.create({
    baseURL: config.baseUrl,
    // timeout: config.timeout,
});

export {requestClient};
