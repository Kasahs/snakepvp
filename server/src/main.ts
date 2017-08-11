import * as express from 'express'
import * as io from 'socket.io'
import * as http from 'http'
import * as ejs from 'ejs'
import * as settings from './settings'


const app = express()
const server = new http.Server(app)

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.set('views', settings.VIEWS_DIR)

// setup static folder path
// example usage : http://localhost:3000/dist/images/kitten.jpg
app.use('/dist', express.static(settings.CLIENT_DIR))


app.get('/', (req, res) => {
  res.render('index')
})

const NAMESPACE = {
  TEST: '/test'
}

const openTestConnection = () => {
  const socket = io(server).of('/test')
  socket.on('connection', (socket) => {
    socket.emit('news', { hello: 'world' })
    socket.on('my other event', (data) => {
      console.log(data)
    })
  })

}

openTestConnection()
server.listen(9999)
console.log('Snakepvp server running at:')
console.dir(server.address())