import * as express from 'express'
import * as io from 'socket.io'
import * as http from 'http'
import * as ejs from 'ejs'
import * as settings from './settings'
import * as conn from './connections'


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

conn.openTestChannel(server)
conn.openControlsRelayChannel(server)
server.listen(9999)
console.log('Snakepvp server running at:')
console.dir(server.address())