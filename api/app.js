import express from 'express';
import cookieParser from 'cookie-parser';
import { authRoute, chatRoute, messageRoute, postRoute, userRoute }  from './routes/index.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));

console.log("test");

app.use('/api/posts', postRoute)
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/chats', chatRoute)
app.use('/api/messages', messageRoute)
 

app.listen(8800, () => {
    console.log('Server is running on port 8800');
}) 