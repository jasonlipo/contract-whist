import Server from './Server';

let server = new Server();
server.start(process.env.NODE_ENV === 'development' ? 3001 : 8081);