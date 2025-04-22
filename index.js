import express from 'express'


const app = express()

app.get('/', (req,res) => {
    res.send('Welcome to the server')
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))