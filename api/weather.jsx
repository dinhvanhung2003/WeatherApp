import axios from 'axios';
import {apiKey} from "../constants"
const forecastEndpoint=params=>`https://api.weatherapi.com/v1/forecast.json?key=8e18142c546c45aaa1b192026241508&q=${params.cityName}&days=${params.days}1&aqi=no&alerts=no`;
const locationsEndpoint=params=>`https://api.weatherapi.com/v1/search.json?key=8e18142c546c45aaa1b192026241508&q=${params.cityName}`;
const apiCall = async (endpoint) => {
    const options = {
      method: 'GET',
      url: endpoint
    };
  
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (err) {
      console.log('error:', err);
      return null;
    }
  };
  
  export const fetchWeatherForecast = (params) => {
    return apiCall(forecastEndpoint(params));
  };
  
  export const fetchLocations = (params) => {
    return apiCall(locationsEndpoint(params));
  };
