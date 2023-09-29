// import net from 'net'
import type { Plugin } from 'vite'

// function getNextPort(port: number) {
//   return new Promise((resolve) => {
//     const server = net.createServer()
//     server.unref()
//     server.on('error', () => {
//       resolve(getNextPort(port + 1))
//     })
//     server.listen(port, () => {
//       server.close(() => {
//         resolve(port)
//       })
//     })
//   })
// }

function myPlugin(): Plugin {
  let port = 8080

  return {
    name: 'auto-switch-port',
    config(config, env) {
        console.log(config, env)
    },
    configResolved(config) {
      // port = await getNextPort(port) as number
      // config.server.port = 9000
      // console.log(config)
    },
    transformIndexHtml(html) {
      console.log(html)
    }
  }
}

export default myPlugin