import express from 'express';
import cookieParser from 'cookie-parser';
import { authRoute, chatRoute, messageRoute, postRoute, userRoute }  from './routes/index.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


app.use('/api/posts', postRoute)
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/chats', chatRoute)
app.use('/api/messages', messageRoute)
app.use('/test', userRoute)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}) 