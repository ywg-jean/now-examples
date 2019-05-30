const url = require('url');
const connect = require("../../lib/db");

module.exports = async (req, res) => {
  // Connect to MongoDB and get the database
  const database = await connect()

  // Select the "signatures" collection from the database
  const signaturesCollection = await database.collection('signatures')

  // Parse queries
  const { query } = url.parse(req.url, true);

  await signaturesCollection.deleteOne({ id: query.id })

  return require('./list')(req, res);
}