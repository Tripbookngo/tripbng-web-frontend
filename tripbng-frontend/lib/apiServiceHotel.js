import axios from "axios";
import { v4 as uuidv4 } from "uuid";

/** 
 * Base URL for API requests. 
 */
const BASE_URL = "https://nexus.prod.zentrumhub.com/api";

/**
 * Get or generate a correlationId.
 * - It **persists** between the `handleRedirect` and `handleBooking` calls.
 * - **Only resets** after a successful booking.
 */
const getCorrelationId = (forceNew = false) => {
  let correlationId = localStorage.getItem("correlationId");
  if (!correlationId || forceNew) {
    correlationId = uuidv4();
    localStorage.setItem("correlationId", correlationId);
  }
  return correlationId;
};

/**
 * Get common headers for API requests.
 */
const getApiHeaders = () => ({
  "Content-Type": "application/json; charset=utf-8",
  "Accept-Encoding": "gzip, deflate",
  accountId: "tripbng-live-account",
  "customer-ip": "223.236.113.114",
  correlationId: getCorrelationId(),
  apiKey: "bc46745f-8af7-473a-aeba-c6ce4efa18e5",
});

/**
 * Generic function for making GET requests.
 */
export const apiGet = (endpoint, params = {}) => {
  return axios.get(`${BASE_URL}/${endpoint}`, {
    headers: getApiHeaders(),
    params,
  });
};

/**
 * Generic function for making POST requests.
 */
export const apiPost = (endpoint, data) => {
  return axios.post(`${BASE_URL}/${endpoint}`, data, {
    headers: getApiHeaders(),
  });
};

/**
 * Reset correlationId **only after a successful booking**.
 */
export const resetCorrelationId = () => {
  localStorage.removeItem("correlationId");
};
