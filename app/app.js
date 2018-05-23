const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('./config');
const bookingRouter = require('./routes/routers/booking-router');
const tickRouter = require('./routes/routers/tick-router');
const carRouter = require('./routes/routers/car-router');
const resetRouter = require('./routes/routers/reset-router');

const app = express();
app.use(morgan('common'));
app.use(bodyParser.json());
app.use('/api/book/', bookingRouter);
app.use('/api/tick/', tickRouter);
app.use('/api/cars/', carRouter);
app.use('/api/reset/', resetRouter);

app.listen(config.PORT, () => console.log(`listening on port ${config.PORT}`));