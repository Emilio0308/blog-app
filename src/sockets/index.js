const PostServices = require('../services/post.services');

class Sockets {
  constructor(io) {
    this.io = io;
    this.postService = new PostServices();
    this.socketsEvents();
  }

  socketsEvents() {
    this.io.on('connection', (socket) => {
      console.log('cliente conectado');

      socket.on('new-post', async ({ id }) => {
        try {
          const post = await this.postService.findPost(id)
          const newpost = await this.postService.downloadImgsPost(post)

          socket.broadcast.emit('render-new-post', newpost)
        } catch (error) {
          throw new Error(error)
        }
      })
    });
  }
}

module.exports = Sockets;
