const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const articles = require('./routes/api/endpoint');
app.use('/api/', articles);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/public/'));
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Listening @ localhost:${port}`));
