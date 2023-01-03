import express from 'express';
import cfg from './config/index.js';
import { carRouter, carsRouter } from './api/car/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/car', carRouter);
app.use('/api/cars', carsRouter);

app.get('*', function (req, res){
  res.send("<h1>Resource is ok</h1><div>But you're using a wrong route</div>");
});

app.listen(cfg.SERVER_PORT, () => {
  console.log(`Server is listening on ${cfg.SERVER_PORT}`);
});