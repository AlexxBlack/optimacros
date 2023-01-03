import express from 'express';
import { Document, MongoClient, WithId, ObjectId } from "mongodb";
import cfg from '../../config/index.js';

const client = new MongoClient(cfg.MONGO_URI);
const database = client.db('optimacros');
const cars = database.collection('cars');

let carRouter = express.Router();

carRouter.get("/:id", async (req, res, next) => {
  try {
    const result = await cars.findOne({_id: new ObjectId(req.params.id)});
    res.send(result);
  } catch (e) {
    next(e);
  }
});

carRouter.post("/", async (req, res, next) => {
  try {
    const car = req.body.car;
    const result = await cars.insertOne(car);
    res.send(result);
  } catch (e) {
    next(e);
  }
});

carRouter.delete("/:id", async (req, res, next) => {
  try {
    const result = await cars.deleteOne({_id: new ObjectId(req.params.id)});
    if (result.deletedCount) {
      res.status(200).send('ok');
    } else {
      res.status(404).send('not found');
    }
  } catch (e) {
    next(e);
  }

});

let carsRouter = express.Router();

carsRouter.get("/", async (req, res, next) => {
  try {
    const pointer = cars.find();
    let result: Document[] = [];
    await pointer.forEach((i: WithId<Document>) => {
      result.push(i)
    });
    res.send(result);
  } catch (e) {
    next(e);
  }
});

carsRouter.get("/:orderBy", async (req, res, next) => {
  try {
    let result: Document[] = [];
    const orderFieldName = req.params.orderBy.split("order-by-")[1];
    if (orderFieldName) {
      const pointer = cars.find().sort(`${orderFieldName}`, 1);
      await pointer.forEach((i: WithId<Document>) => {
        result.push(i)
      });
    }
    res.send(result);
  } catch (e) {
    next(e);
  }
});

export {
  carRouter,
  carsRouter,
};