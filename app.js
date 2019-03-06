import express from 'express';
import cors from 'cors';
import shortid from 'shortid';
// these imports allow us access to express, cors, and shortid

const app = express();
// this creates an instance of express for our application

app.use(cors());
// enables cors for our application
app.use(express.json());
// tells the app to parse the response body to json every time

app.locals.notes = [];
// initializes our notes key as an empty array on the locals object

const send422 = (res) => (
  res.status(422).json('Please send a note with a title, list items, and a color')
);
// this function takes the response and adds an associated message for the status code 422

const send404 = (res) => (
  res.status(404).json('Note not found')
);
// this function takes the response and adds an associated message for the status code 404

app.get('/api/v1/notes', (req, res) => res.status(200).json(app.locals.notes));
// this sets the get request to the '/api/v1/notes' path and adds an associated response of the current notes array from app.locals.notes with the status code 200

app.post('/api/v1/notes', (req, res) => {
  const { title, listItems, color } = req.body;
  const { notes } = app.locals;
  if (!title || !listItems || !color) return send422(res);
  const id = shortid.generate();
  const newNote = { id, title, listItems, color };
  notes.push(newNote);
  res.status(201).json(notes[notes.length - 1]);
});
// this sets the post request to the '/api/v1/notes' path. 
// the function destructures the title, listItems, and color associated with the note to be posted from the request body.
// it then destructures the notes from the app.locals object.
// it checks for if there is no title, listItems, or color, return the invocation of the send422 func therefore exiting the function all together.
// if there is, create a new id, a newNote object, push the newNote into the notes array, 
// and then send a response status of 201 with the associated response of the new note.

app.get('/api/v1/notes/:id', (req, res) => {
  const { notes } = app.locals;
  const { id } = req.params;
  const note = notes.find(note => note.id === id);
  if (!note) return send404(res);
  res.status(200).json(note);
});
// this sets the get request for when a user wants a particular single note to the '/api/v1/notes/:id' path
// it destructures notes from app.locals and id from the request params (which is always a string)
// it then finds the matching note using the id
// if there's no matching note, it returns the invocation of the send404 function
// if there is, sends a status of 200 and the matching note

app.delete('/api/v1/notes/:id', (req, res) => {
  const { notes } = app.locals;
  const { id } = req.params;
  if (!notes.find(note => note.id === id)) return send404(res);
  app.locals.notes = notes.filter(note => {
    return note.id !== id;
  });
  res.sendStatus(204);
});
// this sets the delete request to the '/api/v1/notes/:id' path
// it destructures notes from app.locals and id from the request params (which is always a string)
// if there's no matching note, it returns the invocation of the send404 function
// if there is, it filter the notes array to only be notes that don't match the id
// then sends a status of 204

app.put('/api/v1/notes/:id', (req, res) => {
  const { notes } = app.locals;
  const { title, listItems, color } = req.body;
  const { id } = req.params;
  if (!notes.find(note => note.id === id)) return send404(res);
  if (!title || !listItems || !color) return send422(res);
  app.locals.notes = notes.map(note => {
    return (note.id === id) ? { title, listItems, id, color } : note;
  });
  res.sendStatus(204);
});
// this sets the put request to the '/api/v1/notes/:id' path 
// it destructures notes from app.locals, title/listItems/color from the request body, and id from the request params
// if no matching note id, then return the invocation of send404 
// if no title/listItem/color, then return the invocation of send422
// if neither of those are true, map over all the notes and return either a new note object or the original note
// then sendStatus with 204

app.put('/api/v1/notes', (req, res) => {
  const { notes } = req.body;
  if (!notes) return send422(res);
  app.locals.notes = notes;
  res.sendStatus(204);
});
// this sets a put path to all of the notes at '/api/v1/notes'
// if no notes, return invocation of send422
// if there are, reassign app.locals.notes to the sent notes 
// then sendStatus of 204

export default app;