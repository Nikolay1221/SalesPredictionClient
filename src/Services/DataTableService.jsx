import axios from "axios";

const REST_API_BASE_URL = 'https://localhost:8080/api/files';

export const handleTableRequest = (tableId, method, data) => {
    if (!tableId) {
        throw new Error('Table ID is required');
    }

    const url = `${REST_API_BASE_URL}/${tableId}/turnover-data`;

    switch (method.toLowerCase()) {
        case 'get':
            return axios.get(url);
        case 'delete':
            return axios.delete(url);
        case 'post':
            return axios.post(url, data);
        default:
            throw new Error('Unsupported HTTP method');
    }
};
export const handleTableDataRequest = (rowId, tableId, method) => {
    if (!tableId) {
        throw new Error('Table ID is required');
    }
    if (!rowId) {
        throw new Error('Row ID is required');
    }
    const REST_API_BASE_URL = 'https://localhost:8080/api/files';
    const url = `${REST_API_BASE_URL}/${tableId}/turnover-data/${rowId}`;

    switch (method.toLowerCase()) {
        case 'delete':
            return axios.delete(url);
        default:
            throw new Error('Unsupported HTTP method');
    }
};
