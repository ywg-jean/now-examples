// Import dependencies
const url = require('url')
const connect = require("../../lib/db");

module.exports = async (req, res) => {
  // Connect to MongoDB and get the database
  const database = await connect()

  // Select the "signatures" collection from the database
  const signaturesCollection = await database.collection('signatures')

  // Parse queries
  const { query } = url.parse(req.url, true);

  // Set defaults
  let limit = parseInt(query.limit) || 9
  let page = parseInt(query.page) || 1

  // If page query is less than one, default to 1
  if (page < 1) page = 1

  // If limit query is less than one or more than a hundred, default to either
  if (limit < 1) limit = 1
  if (limit > 100) limit = 100

  // Get all signatures from the database, sort the by most recently updated,
  // Add a limit to the data, and handle pagination
  const guestbook = await signaturesCollection.find().sort({ updated: -1 }).limit(limit).skip((page-1)*limit).toArray()

  // Get full count of profiles in collection and work out the number
  // of pages there will be, using the limit
  const signaturesCount = await signaturesCollection.countDocuments()
  const pageCount = Math.ceil(signaturesCount / limit);

  // Return a JSON string containing signatures, total signatures count,
  // and amount of pages, for the UI
  res.end(JSON.stringify({ guestbook, total: signaturesCount, pageCount }))
  return
}