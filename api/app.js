import express from 'express';
import { postRoute }  from './routes/index.js';

const app = express();

console.log("test");

app.use('/api/posts', postRoute)


app.listen(8800, () => {
    console.log('Server is running on port 8800');
})