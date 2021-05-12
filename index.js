const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const envs = require('./config/env');
const config = require('./config/config').get(envs.NODE_ENV);

const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artist');

const app = express();
app.use(
  bodyparser.urlencoded({
    extended: false,
  })
);
app.use(bodyparser.json());
app.use(cookieParser());

app.get('/', function (req, res) {
  res.status(200).send({ message: 'Welcome to Music Manager API..' });
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


// const corsOptions = {
//   origin: '*',
//   credentials: true
// };
// app.use(cors(corsOptions));

// const whitelist = ['http://localhost:3000', 'https://music-manager-client.netlify.app'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   credentials: true
// };
// app.use(cors(corsOptions, (req, res, next) => {
//   return res.json({
//     message: 'This is a CORS-enabled for a whitelisted Domain!'
//   })
// }));


// Routes go here
app.use(authRoutes);
app.use(artistRoutes);

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(
  config.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function (err) {
    if (err) console.log(err);
    console.log('DB Connected.');
  }
);

// listening port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`app is live at ${PORT}`);
});
