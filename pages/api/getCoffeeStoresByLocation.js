import { fetchCoffeeStores } from '../../lib/coffee-stores';

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latitude, longitude, limit } = req.query;
    const response = await fetchCoffeeStores(latitude, longitude, limit);
    res.status(200);
    res.json(response);
  } catch (error) {
    console.log('There is an error: ', error);
    res.status(500);
    res.json({ message: 'Oh no! Something went wrong.' });
  }
};

export default getCoffeeStoresByLocation;
