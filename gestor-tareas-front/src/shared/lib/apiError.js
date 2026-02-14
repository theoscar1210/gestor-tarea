import axios from "axios";

/**
 * @typedef {Object} ApiError
 * @property {number} status
 * @property {string} message
 * @property {string[]} details
 * @property {boolean} retryable
 */

/**
 * @param {unknown} error
 * @returns {ApiError}
 */
export const normalizeApiError = (error) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;

    return {
      status,
      message:
        data?.message ||
        error.message ||
        "No se pudo completar la solicitud en este momento.",
      details: Array.isArray(data?.details) ? data.details : [],
      retryable: status >= 500 || status === 0,
    };
  }

  return {
    status: 0,
    message: "Error inesperado del cliente.",
    details: [],
    retryable: true,
  };
};
