import express from 'express';
import cookieParser from 'cookie-parser';
import { authRoute, chatRoute, messageRoute, postRoute, userRoute }  from './routes/index.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname)

const app = express();
const PORT = process.env.PORT || 4000

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/posts', postRoute)
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/chats', chatRoute)
app.use('/api/messages', messageRoute)
app.use('/test', userRoute)

app.get('/*', (req, res) => {
    res.send('Hello World!')
})

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/frontend/dist/index.html')));

app.listen(PORT, () => {
    console.log(`S  erver is running on port ${PORT}`);
}) 