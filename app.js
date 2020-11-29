const dotenv = require('dotenv');
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const forumRouter = require('./routes/forumRoutes');
const {signUp} = require('./controller/User')

dotenv.config({path: './config.env'});

mongoose
  .connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log(`DB connection successfull`);
  });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/forum', forumRouter)

app.listen(8000, function() {
    console.log('app running on port 8000...')
})