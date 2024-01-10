const axios = require("axios");
const { TIMEOUT } = process.env;

module.exports = (apiUrl) => {
  return axios.create({
    baseURL: apiUrl,
    timeout: parseInt(TIMEOUT),
  });
};
