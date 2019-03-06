import app from './app';
import { client } from './db';

app.set('port', 3001);

app.listen(app.get('port'), () => {
  console.log(`App is running on http://localhost:${app.get('port')}`);
  client.connect().then(() => console.log('MongoDB connected...'));
});