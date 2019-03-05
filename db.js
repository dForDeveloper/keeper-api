import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

export const findOrCreateUser = (user, res) => {
  MongoClient.connect(uri, { useNewUrlParser: true }, async (error, client) => {
    if (error) return res.sendStatus(500);
    const collection = client.db().collection('users');
    const foundUser = await collection.findOne({ uid: user.uid });
    if (!foundUser) {
      const newUser = { ...user, notes: [] };
      await collection.insertOne(newUser);
      res.status(200).json(newUser);
    } else {
      res.status(200).json(foundUser);
    }
    client.close();
  });
}