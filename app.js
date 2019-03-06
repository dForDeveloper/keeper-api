import express from 'express';
import cors from 'cors';
import shortid from 'shortid';
import * as db from './db';

const app = express();
app.use(cors());
app.use(express.json());

app.locals.notes = [];

const send422 = (res) => (
  res.status(422).json('Please send a note with a title, list items, and a color')
);

const send404 = (res) => (
  res.status(404).json('Note not found')
);

app.get('/api/v1/notes', (req, res) => res.status(200).json(app.locals.notes));

app.post('/api/v1/notes', (req, res) => {
  const { title, listItems, color, user } = req.body;
  if (!title || !listItems || !color) return send422(res);
  const id = shortid.generate();
  const newNote = { id, title, listItems, color };
  db.createNote(user, newNote);
  res.status(201).json(newNote);
});

app.put('/api/v1/notes', (req, res) => {
  const { notes } = req.body;
  if (!notes) return send422(res);
  app.locals.notes = notes;
  res.sendStatus(204);
});

app.get('/api/v1/notes/:id', (req, res) => {
  const { notes } = app.locals;
  const { id } = req.params;
  const note = notes.find(note => note.id === id);
  if (!note) return send404(res);
  res.status(200).json(note);
});

app.delete('/api/v1/notes/:id', (req, res) => {
  const { notes } = app.locals;
  const { id } = req.params;
  let found = false;
  app.locals.notes = notes.filter(note => {
    note.id === id && (found = true);
    return note.id !== id;
  });
  if (!found) return send404(res);
  res.sendStatus(204);
});

app.put('/api/v1/notes/:id', (req, res) => {
  const { notes } = app.locals;
  const { title, listItems, color } = req.body;
  const { id } = req.params;
  if (!title || !listItems || !color) return send422(res);
  let found = false;
  app.locals.notes = notes.map(note => {
    note.id === id && (found = true);
    return (note.id === id) ? { title, listItems, id, color } : note;
  });
  if (!found) return send404(res);
  res.sendStatus(204);
});

app.post('/api/v1/users', async (req, res) => {
  const user = await db.findOrCreateUser(req.body);
  res.status(200).json(user);
});

export default app;