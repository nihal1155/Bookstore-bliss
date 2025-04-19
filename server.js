const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config();
const app = express();
connectDB();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
}
);

app.use((req, res, next) => {
  console.log('Time:', new Date().toISOString());
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);
  console.log('Request Params:', req.params);
  next();
}
);

app.get('/', (req, res) => {
  res.send('Hello World!');
}
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

