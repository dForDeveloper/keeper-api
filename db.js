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
  client.db('keeper').collection('users').updateOne(
    { uid: user.uid },
    { $push: { notes: note } }
  );
}

export const editNote = async (user, note) => {
  const result = await client.db('keeper').collection('users').updateOne(
    { uid: user.uid },
    { $set: { 'notes.$[note]': note } },
    { arrayFilters: [{ 'note.id': note.id }] }
  );
  return result.matchedCount;
}

export const deleteNote = async (user, noteID) => {
  const result = await client.db('keeper').collection('users').updateOne(
    { uid: user.uid },
    { $pull: { notes: { id: noteID } } }
  );
  return result.matchedCount;
}

export const updateNotes = async (user, notes) => {
  client.db('keeper').collection('users').updateOne(
    { uid: user.uid },
    { $set: { notes } }
  );
}