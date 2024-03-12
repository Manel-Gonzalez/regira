const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
// cors necessari quan api/front son a servidors diferents
app.use(cors({ origin: 'http://localhost:5173', credentials: true ,methods:"GET,PUT,POST,PATCH,DELETE,HEAD","preflightContinue":false}));
// permet llegir les cookies
app.use(cookieParser());

// Routes
app.use('/api', routes);

// iniciem servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
