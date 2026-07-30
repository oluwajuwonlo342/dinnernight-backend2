// Vercel's @vercel/node builder treats this file's export as the request
// handler. An Express app instance is itself a valid (req, res) handler,
// so exporting it directly here is all that's needed — no app.listen().
module.exports = require('./app');
