import express from 'express';
import cors from 'cors';

const app = express();
app.set('port', 3001);
app.use(cors());
app.use(express.json());

app.locals.notes = [{ id: 0, title: 'first note', listItems: ['build backend'] }];

app.listen(app.get('port'), () => {
  console.log(`App is running on http://localhost:${app.get('port')}`);
});


app.get('/api/v1/notes', (req, res) => {
  res.status(200).json(app.locals.notes);
});

app.post('/api/v1/notes', (req, res) => {
  const { title, listItems } = req.body;
  if (!title || !listItems) {
    res.status(422).json('Please send a note with a title and list items');
  } else {
    const newNote = {
      id: Date.now(),
      title,
      listItems
    };
    app.locals.notes.push(newNote);
    res.status(201).json(newNote);
  }
});

app.get('/api/v1/notes/:id', (req, res) => {
  const note = app.locals.notes.find(note => {
    return note.id === parseInt(req.params.id);
  });
  if (!note) {
    res.status(404).json('Note not found');
  } else {
    res.status(200).json(note);
  }
});

app.delete('/api/v1/notes/:id', (req, res) => {
  if (!app.locals.notes.find(note => note.id === parseInt(req.params.id))) {
    res.status(404).json('Note not found');
  }
  app.locals.notes = app.locals.notes.filter(note => {
    return note.id !== parseInt(req.params.id);
  });
  res.status(200).json('Successfully deleted');
});

app.put('/api/v1/notes/:id', (req, res) => {
  const { title, listItems, id } = req.body;
  if (!title || !listItems || !id || id !== req.params.id) {
    res.status(422).json('Please send a note with an id, title, and list items');
  } else {
    app.locals.notes = app.locals.notes.map(note => {
      if (note.id === parseInt(req.params.id)) {
        return {
          title,
          listItems,
          id: parseInt(id)
        };
      }
      return note;
    });
    res.status(200).json(app.locals.notes);
  }
});