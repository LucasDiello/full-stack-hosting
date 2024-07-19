import express from 'express';

const router = express.Router();

router.post('/register', (req, res) => {
    res.send('Hello World');
})

router.post('/login', (req, res) => {
    res.send('Hello World');
})

router.post('/logout', (req, res) => {
    res.send('Hello World');
})




export default router;