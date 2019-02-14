import express from 'express';
import cors from 'cors';
import shortid from 'shortid';

const app = express();

app.use(cors());
app.use(express.json());

app.locals.notes = [];

const send422 = (res) => (
  res.status(422).json('Please send a note with a title and list items')
);

const send404 = (res) => (
  res.status(404).json('Note not found')
);

app.get('/api/v1/notes', (req, res) => res.status(200).json(app.locals.notes));

app.post('/api/v1/notes', (req, res) => {
  const { title, listItems } = req.body;
  const { notes } = app.locals;
  if (!title || !listItems) return send422(res);
  const id = shortid.generate();
  const newNote = { id, title, listItems };
  notes.push(newNote);
  res.status(201).json(notes[notes.length - 1]);
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
  if (!notes.find(note => note.id === id)) return send404(res);
  app.locals.notes = notes.filter(note => {
    return note.id !== id;
  });
  res.sendStatus(204);
});

app.put('/api/v1/notes/:id', (req, res) => {
  const { notes } = app.locals;
  const { title, listItems } = req.body;
  const { id } = req.params;
  if (!notes.find(note => note.id === id)) return send404(res);
  if (!title || !listItems) return send422(res);
  app.locals.notes = notes.map(note => {
    return (note.id === id) ? { title, listItems, id } : note;
  });
  res.sendStatus(204);
});

export default app;