const express = require('express');
const mongoose = require('mongoose');

const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const envs = require('./config/env');
const config = require('./config/config').get(envs.NODE_ENV);

// multer
const multer = require('multer');
const upload = multer({dest: 'images/'});

const authRoutes = require('./routes/auth');
const artistRoutes = require('./routes/artist');
const campaignRoutes = require('./routes/campaign');

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
  // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// multer
// app.use(upload.single('artworkUrl')); 
app.use(upload.fields([
  {
    name: 'campaignImg',
    maxCount: 1
  },
  {
    name: 'profileImg',
    maxCount: 1
  },
  {
    name: 'artistImg',
    maxCount: 1
  }
]));

// Routes go here
app.use(authRoutes);
app.use(artistRoutes);
app.use(campaignRoutes);

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(
  config.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
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
