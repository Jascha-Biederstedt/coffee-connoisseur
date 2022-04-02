import { createApi } from 'unsplash-js';

const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (query, lat, long, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat}%2C${long}&limit=${limit}`;
};

export const fetchCoffeeStores = async () => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores('cafe', 52.519406628133474, 13.401662014630679, 6),
    options
  );

  const data = await response.json();

  return data.results;
};
