const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY);

const table = base('coffee-stores');

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    const findCoffeeStoreRecords = await table
      .select({ filterByFormula: `id='0'` })
      .firstPage();

    console.log({ findCoffeeStoreRecords });

    if (findCoffeeStoreRecords.length !== 0) {
      res.json(findCoffeeStoreRecords);
    } else {
      res.json({ message: 'create a record' });
    }
  }
};

export default createCoffeeStore;
