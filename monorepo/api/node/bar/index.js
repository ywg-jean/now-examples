import express from 'express';

const app = express();
app.get('*', async (req, res) => {
  res.send(new Date().toString());
});

export default app;