import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import AuthenticationRoute from './Routes/auth.js'
import NotFound from './ErrorClass/notFound.js'
import errorHandlerMiddleware from './ErrorClass/error-handler.js'

const app = express()

app.use(express.json())
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
)
app.use('/api/auth', AuthenticationRoute)


app.get('/', (req,res) => {
    res.send('Welcome to the server')
})

app.use(NotFound)
app.use(errorHandlerMiddleware)


const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running on ${port}`))