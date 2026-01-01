/*
 * [2025-07-23] João Neto:
 * Exemplo de API que podemos utilizar
 */

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL  || 'http://localhost:3000',
});

export default api;
