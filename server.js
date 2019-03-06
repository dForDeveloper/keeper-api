import app from './app';

app.set('port', 3001);
// This method sets the port that the server will run on to port 3001.

app.listen(app.get('port'), () => {
  console.log(`App is running on http://localhost:${app.get('port')}`);
});
// this method listens for when the port is successfully running, and when it is, it will console log to let you know.