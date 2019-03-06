import express from 'express';
import cors from 'cors';
import shortid from 'shortid';
import * as db from './db';

const app = express();
app.use(cors());
app.use(express.json());

const send422 = (res) => (
  res.status(422).json('Please send a note with a title, list items, and a color')
);

const send404 = (res) => (
  res.status(404).json('Note not found')
);

app.post('/api/v1/notes', (req, res) => {
  const { title, listItems, color, user } = req.body;
  if (!title || !listItems || !color) return send422(res);
  const id = shortid.generate();
  const newNote = { id, title, listItems, color };
  db.createNote(user, newNote);
  res.status(201).json(newNote);
});

app.put('/api/v1/notes', async (req, res) => {
  const { notes, user } = req.body;
  if (!notes) return send422(res);
  await db.updateNotes(user, notes);
  res.sendStatus(204);
});

app.delete('/api/v1/notes/:id', async (req, res) => {
  const { user } = req.body;
  const { id } = req.params;
  const found = await db.deleteNote(user, id);
  if (!found) return send404(res);
  res.sendStatus(204);
});

app.put('/api/v1/notes/:id', async (req, res) => {
  const { title, listItems, color, user } = req.body;
  const { id } = req.params;
  const editedNote = { title, listItems, id, color };
  if (!title || !listItems || !color) return send422(res);
  const found = await db.editNote(user, editedNote)
  if (!found) return send404(res);
  res.sendStatus(204);
});

app.post('/api/v1/users', async (req, res) => {
  const user = await db.findOrCreateUser(req.body);
  res.status(200).json(user);
});

export default app;