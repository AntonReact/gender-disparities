const path = require('path');
const cors = require('cors')
const express = require("express");
const { getGenderStats } = require('./getGenderStats');
const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'demo/build')));

app.get("/", (_req, res) => {
  res.sendFile(path.resolve(__dirname, 'demo/build', 'index.html'));
});

app.post("/stats", getGenderStats);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
