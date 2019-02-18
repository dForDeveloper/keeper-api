import request from 'supertest';
import '@babel/polyfill';
import app from './app';
import shortid from 'shortid';

describe('API', () => {
  let notes;
  const path = '/api/v1/notes/';

  beforeEach(() => {
    notes = [
      {
        id: 'ieF',
        title: 'first note',
        listItems: [
          { id: 'rDe', description: 'item1 for 1st note', isComplete: false },
          { id: 'oeK', description: 'item2 for 1st note', isComplete: true }
        ],
        color: 'lavender'
      },
      {
        id: 'Ahd',
        title: 'second note',
        listItems: [
          { id: 'VmE', description: 'item1 for 2nd note', isComplete: true }
        ],
        color: 'blue'
      }
    ]
    app.locals.notes = notes;
  });

  describe('get /api/v1/notes', () => {
    it('should respond with 200 and all the notes', async () => {
      const response = await request(app).get(path);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(notes);
    });
  });

  describe('post /api/v1/notes', () => {
    it('should respond with 201 and the note', async () => {
      const expected = { id: 'jpV', title: 'new', listItems: [], color: 'green' };
      shortid.generate = jest.fn().mockImplementationOnce(() => 'jpV');
      const newNote = { title: 'new', listItems: [], color: 'green' };
      const response = await request(app).post(path).send(newNote);
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(expected);
    });
    
    it('should respond with 422 and a message', async () => {
      const expected = 'Please send a note with a title, list items, and a color';
      const response = await request(app).post(path).send({ sadfadsf: 'adf' });
      expect(response.status).toEqual(422);
      expect(response.body).toEqual(expected);
    });
  });

  describe('get /api/v1/notes/:id', () => {
    it('should respond with 200 and one note', async () => {
      const response = await request(app).get(path + 'ieF');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(app.locals.notes[0]);
    });

    it('should respond with 404 and a message', async () => {
      const response = await request(app).get(path + 'ajd');
      expect(response.status).toEqual(404);
      expect(response.body).toEqual('Note not found');
    });
  });

  describe('delete /api/v1/notes/:id', () => {
    it('should respond with 204', async () => {
      const response = await request(app).delete(path + 'ieF');
      expect(response.status).toEqual(204);
    });

    it('should respond with 404 and a message', async () => {
      const response = await request(app).delete(path + 'asdf');
      expect(response.status).toEqual(404);
      expect(response.body).toEqual('Note not found');
    });
  });

  describe('put /api/v1/notes/:id', () => {
    const note = { title: 'New title', listItems: [], color: 'new color' };
    
    it('should respond with 204', async () => {
      const response = await request(app).put(path + 'ieF').send(note);
      expect(response.status).toEqual(204);
    });

    it('should respond with 404 and a message', async () => {
      const response = await request(app).put(path + 'asd').send(note);
      expect(response.status).toEqual(404);
      expect(response.body).toEqual('Note not found');
    });

    it('should respond with 422 and a message', async () => {
      const expected = 'Please send a note with a title, list items, and a color';
      const response = await request(app).put(path + 'ieF').send({});
      expect(response.status).toEqual(422);
      expect(response.body).toEqual(expected);
    });
  });
});