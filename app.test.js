import request from 'supertest';
import '@babel/polyfill';
import app from './app';
import shortid from 'shortid';

describe('API', () => {
  let notes;

  beforeEach(() => {
    notes = [
      {
        id: 0,
        title: 'first note',
        listItems: [
          { id: 'rDe', description: 'item1 for 1st note', isComplete: false },
          { id: 'oeK', description: 'item2 for 1st note', isComplete: true }
        ]
      },
      {
        id: 1,
        title: 'second note',
        listItems: [
          { id: 'VmE', description: 'item1 for 2nd note', isComplete: true }
        ]
      }
    ]
    app.locals.notes = notes;
  });

  describe('get /api/v1/notes', () => {
    it('should respond with 200 and all the notes', async () => {
      const response = await request(app).get('/api/v1/notes');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(notes);
    });
  });

  describe('post /api/v1/notes', () => {
    const path = '/api/v1/notes';
    
    it('should respond with 201 and all the notes', async () => {
      const expected = [...notes, { id: 'jpV', title: 'new', listItems: [] }];
      shortid.generate = jest.fn().mockImplementationOnce(() => 'jpV');
      const newNote = { title: 'new', listItems: [] };
      const response = await request(app).post(path).send(newNote);
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(expected);
    });
    
    it('should respond with 422 and a message', async () => {
      const response = await request(app).post(path).send({ sadfadsf: 'asdf' });
      expect(response.status).toEqual(422);
      expect(response.body).toEqual('Please send a note with a title and list items');
    });
  });
});