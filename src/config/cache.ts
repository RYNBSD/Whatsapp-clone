import { MongoClient } from "mongodb";
import { ENV, KEYS } from "../constant/index.js";

export async function connect() {
  const mongo = new MongoClient(ENV.URI.MONGO);
  await mongo.connect();
  await mongo
    .db()
    .createCollection(KEYS.CACHE.COLLECTION.SOCKET, {
      capped: true,
      size: 1e6,
    })
    .catch();

  global.mongo = mongo;
}

export async function close(mongo: MongoClient) {
  await mongo?.close();
}
