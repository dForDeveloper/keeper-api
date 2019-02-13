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

const send200 = (res) => (
  res.status(200).json(app.locals.notes)
);

app.get('/api/v1/notes', (req, res) => send200(res));

app.post('/api/v1/notes', (req, res) => {
  const { title, listItems } = req.body;
  if (!title || !listItems) return send422(res);
  const id = shortid.generate();
  const newNote = { id, title, listItems };
  app.locals.notes.push(newNote);
  res.status(201).json(app.locals.notes);
});

app.get('/api/v1/notes/:id', (req, res) => {
  const { id } = req.params;
  if (!notes.find(note => note.id === id)) return send404(res);
  send200(res);
});

app.delete('/api/v1/notes/:id', (req, res) => {
  const { notes } = app.locals;
  const { id } = req.params;
  if (!notes.find(note => note.id === id)) return send404(res);
  app.locals.notes = notes.filter(note => {
    return note.id !== id;
  });
  send200(res);
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
  res.status(200).json(app.locals.notes);
});

export default app;