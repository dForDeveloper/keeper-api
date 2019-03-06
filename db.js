import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI;

export const client = new MongoClient(uri, { useNewUrlParser: true });

export const findOrCreateUser = async (user) => {
  const db = client.db('keeper');
  const collection = db.collection('users');
  const foundUser = await collection.findOne({ uid: user.uid });
  if (!foundUser) {
    const newUser = { ...user, notes: [] };
    await collection.insertOne(newUser);
    return newUser;
  } else {
    return foundUser;
  }
}

export const createNote = (user, note) => {
  const db = client.db('keeper');
  const collection = db.collection('users');
  collection.updateOne({ uid: user.uid }, { $push: { notes: note } });
}