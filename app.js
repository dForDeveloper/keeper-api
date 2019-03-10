import express from 'express';
import cors from 'cors';
import shortid from 'shortid';
// imports the express, cors, and shortid modules

const app = express();
// creates an express application and stores it in the const named app

app.use(cors());
app.use(express.json());
// tells app to use the cors middleware and the express.json middleware

app.locals.notes = [];
// creates a notes property on the app.locals object and initializes it as an empty array

const send422 = (res) => (
  res.status(422).json('Please send a note with a title, list items, and a color')
);
// sends a response with status 422 and a message telling the client that the request was missing data

const send404 = (res) => (
  res.status(404).json('Note not found')
);
// sends a response with status 404 and a message of 'Note not found'

app.get('/api/v1/notes', (req, res) => res.status(200).json(app.locals.notes));
// the callback function executes when the server receives a GET request to the /api/v1/notes endpoint
// sends a response with status 200 and the array of notes stored app.locals

app.post('/api/v1/notes', (req, res) => {
  // the callback function executes when the server receives a POST request to the /api/v1/notes endpoint
  const { title, listItems, color } = req.body;
  const { notes } = app.locals;
  if (!title || !listItems || !color) return send422(res);
  // sends a response with status 422 if the request is missing data
  const id = shortid.generate();
  // generates a new unique id
  const newNote = { id, title, listItems, color };
  // combines the id with the data from the request to make a new note object
  notes.push(newNote);
  // pushes the new note into the app.locals.notes array
  res.status(201).json(notes[notes.length - 1]);
  // sends a response with status 201 and with a body of the last element in the notes array which is the new note
});

app.put('/api/v1/notes', (req, res) => {
  // the callback function executes when the server receives a PUT request to the /api/v1/notes endpoint
  const { notes } = req.body;
  if (!notes) return send422(res);
  // sends a response with status 422 if the request is missing data
  app.locals.notes = notes;
  // reassigns app.locals.notes to the array of notes in the body of the request
  res.sendStatus(204);
  // sends a response with status 204
});

app.get('/api/v1/notes/:id', (req, res) => {
  // the callback function executes when the server receives a GET request to the /api/v1/notes/:id endpoint
  const { notes } = app.locals;
  const { id } = req.params;
  // gets the id of the route that the request was sent to
  const note = notes.find(note => note.id === id);
  // finds the note in app.locals.notes whose id matches the id in req.params
  if (!note) return send404(res);
  // sends a response with status 404 if no note was found
  res.status(200).json(note);
  // sends a response with status 200 and with a body of the note that was found
});

app.delete('/api/v1/notes/:id', (req, res) => {
  // the callback function executes when the server receives a DELETE request to the /api/v1/notes/:id endpoint
  const { notes } = app.locals;
  const { id } = req.params;
  // gets the id of the route that the request was sent to
  let found = false;
  app.locals.notes = notes.filter(note => {
    note.id === id && (found = true);
    return note.id !== id;
  });
  // reassigns app.locals.notes to an array of only the notes whose id does not match the id in req.params
  if (!found) return send404(res);
  // sends a response with status 404 if no note was found  
  res.sendStatus(204);
  // sends a response with status 204
});

app.put('/api/v1/notes/:id', (req, res) => {
  // the callback function executes when the server receives a PUT request to the /api/v1/notes/:id endpoint
  const { notes } = app.locals;
  const { title, listItems, color } = req.body;
  const { id } = req.params;
  // gets the id of the route that the request was sent to
  if (!title || !listItems || !color) return send422(res);
  // sends a response with status 422 if the request is missing data
  let found = false;
  app.locals.notes = notes.map(note => {
    note.id === id && (found = true);
    return (note.id === id) ? { title, listItems, id, color } : note;
    // if the note's id matches the id in req.params, a note with the properties sent in the request body is returned
    // otherwise if the ids do not match, the note is returned unchanged
  });
  if (!found) return send404(res);
  // sends a response with status 404 if no note was found  
  res.sendStatus(204);
  // sends a response with status 204
});

export default app;