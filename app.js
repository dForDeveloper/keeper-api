import express from 'express';
import cors from 'cors';
import shortid from 'shortid';

const app = express(); //instance of our Express appliation

app.use(cors()); //enable CORS support
app.use(express.json()); //app parses the request body to json by default now

app.locals.notes = []; //app.locals object has properties that are local variables within the application

const send422 = (res) => (
  res.status(422).json('Please send a note with a title, list items, and a color')
); 
//sets the HTTP status for the response to 422 and sends a JSON response telling the dev
//to Please send a note with a title... etc.

const send404 = (res) => (
  res.status(404).json('Note not found')
);
//sets the HTTP status for the response to 404 and sends a JSON response that No Note was found

app.get('/api/v1/notes', (req, res) => res.status(200).json(app.locals.notes));
//handles a GET request to /api/v1/notes
//sending back a status of 200 and a JSON response of the 
//array of notes stored in app.locals.notes

app.post('/api/v1/notes', (req, res) => {
  const { title, listItems, color } = req.body;
  const { notes } = app.locals;
  if (!title || !listItems || !color) return send422(res);
  const id = shortid.generate();
  const newNote = { id, title, listItems, color };
  notes.push(newNote);
  res.status(201).json(notes[notes.length - 1]);
});
//handles a POST request to /api/v1/notes
//destructures the body of the request and then notes from app.locals
//if the request body did not include a title, list items or color property
//then return the result of send422(res)
//otherwise create a shortid, and a newNote object with that new id
//add the newNote object to the end of app.locals.notes array
//send back a status of 201 and a JSON response of the newNote object

app.put('/api/v1/notes', (req, res) => {
  const { notes } = req.body;
  if (!notes) return send422(res);
  app.locals.notes = notes;
  res.sendStatus(204);
});
//handles a PUT request to /api/v1/notes
//destructures notes from the body of the request
//if there are no notes sent in the request body then return the result of dend422(res)
//otherwise reassign app.locals.notes to the notes from the request body
//send back a status of 204

app.get('/api/v1/notes/:id', (req, res) => {
  const { notes } = app.locals;
  const { id } = req.params;
  const note = notes.find(note => note.id === id);
  if (!note) return send404(res);
  res.status(200).json(note);
});
//handles a GET request to /api/v1/notes/:id for a specific note
//destructures notes from app.locasl and the id from the request params object
//assign note to the result of notes.find() which will return the first note that matches
//the id, or if there is none will return undefined
//if no note is found then return the result of send404(res)
//otherwise send back a status of 200 and a JSON response of the note found

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
//handles a DELETE request to /api/v1/notes/:id
//destructures note from app.locals and the id from request params
//declares a variable found and assign it to false
//reassigns app.locals.notes to the result of notes.filter()
//which returns a new array of notes that only includes notes that do not
//have an id property that matches the id from request params
//while iterating over notes, if there is a note whose id matches the id from request params
//found is reassigned to true
//if the value of found is false, return the result of send404(res)
//otherwise sendback a status of 204

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
//handles a PUT request to /api/vi/notes/:id
//destructures notes from app.locals and title, listItems and color from the request body
//also destructures id from the request params object
//if the request body did not include a title, list items or color property, then
//return the result of send322(res)
//otherwise, declares a variable found and assign it to false
//reassign app.locals.notes to the result of notes.map(), which returns a new
//array of the same length, during iteration if a note.id matches the id from
//request params then reassign found to the value of true and 
//returning the title, listItems, id and color from the request body as a new object in place
//of that note otherwise returning the note
//if the value of found is false return the result of send404(res)
//otherwise send back a status of 204

export default app;