import axios from "axios";

const REST_API_BASE_URL = 'https://localhost:8080/api/files';

export const allTables = () => axios.get(REST_API_BASE_URL);