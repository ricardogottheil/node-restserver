require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//IMPORT & USE usuario routes
app.use(require('./routes/index'));

mongoose.connect(
  process.env.URLDB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err, res) => {
    if (err) throw err;
    console.log('BD online');
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriento en el puerto ${process.env.PORT}`);
});
