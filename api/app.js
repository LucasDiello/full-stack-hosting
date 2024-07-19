import express from 'express';
import { authRoute, postRoute }  from './routes/index.js';

const app = express();

app.use(express.json());

console.log("test");

app.use('/api/posts', postRoute)
app.use('/api/auth', authRoute)

app.listen(8800, () => {
    console.log('Server is running on port 8800');
}) 