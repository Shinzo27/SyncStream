import http from 'http'
import dotenv from 'dotenv'
import SocketService from './service/socketService'

dotenv.config()

async function main() {
  const socketService = new SocketService()
  const server = http.createServer()

  socketService.io.attach(server)

  server.listen(8000, () => {
    console.log('Server running on port 3000')
  })

  socketService.initListener()
}

main()