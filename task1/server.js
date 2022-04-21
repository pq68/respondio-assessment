const express = require('express');
const app = express();
const dotenv = require('dotenv'); 
const path = require('path');

dotenv.config({ 
    path: path.resolve(__dirname, `./env/.${process.env.NODE_ENV}.env`)
});

// CORS
const cors = require('cors');
let corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const sequelize  = require('./models/index');
sequelize
    .sync()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

// Routes
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});