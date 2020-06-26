import { generate_deck } from './utils';
import { http_server } from './http';
import { websocket_server } from './websocket';

const clients = {}
const server = http_server()
const deck = generate_deck()

websocket_server(server, clients, deck)