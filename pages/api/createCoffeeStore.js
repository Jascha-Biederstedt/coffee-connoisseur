const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_KEY);

const table = base('coffee-stores');

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const findCoffeeStoreRecords = await table
        .select({ filterByFormula: `id='0'` })
        .firstPage();

      console.log({ findCoffeeStoreRecords });

      if (findCoffeeStoreRecords.length !== 0) {
        const records = findCoffeeStoreRecords.map(record => {
          return {
            ...record.fields,
          };
        });
        res.json(records);
      } else {
        res.json({ message: 'create a record' });
      }
    } catch (error) {
      console.error('Error finding store', error);
      res.status(500);
      res.json({ message: 'Error finding store', error });
    }
  }
};

export default createCoffeeStore;
