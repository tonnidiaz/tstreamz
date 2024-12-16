import axios from "axios";

const options = {
    baseURL: 'https://real-time-news-data.p.rapidapi.com',
    params: {
      topic: 'TECHNOLOGY',
      limit: '500',
      country: 'US',
      lang: 'en'
    },
    headers: {
      'x-rapidapi-key': '71e962e760mshe177840eb7630a1p1ce7a7jsncff43c280599',
      'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com'
    }
  };

  export const newsApi = axios.create(options)