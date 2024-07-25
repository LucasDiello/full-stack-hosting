import { Server } from 'socket.io'

const io = new Server({
    cors: {
        origin: "http://localhost:5173",
    },
})

io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg)
    }   )
})