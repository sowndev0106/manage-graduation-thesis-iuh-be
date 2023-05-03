import { Server, Socket } from 'socket.io';
import SocketService from './SocketService';
import http from 'http';

export default class ServerSocker {
	private server: Server;
	constructor(serverHttp: http.Server) {
		this.server = new Server(serverHttp, {
			cors: {
				origin: '*',
			},
		});

		this.onEvent();

		// init socker service
		SocketService.initSocket(this.server);
	}
	private onEvent() {
		this.server.on('connection', this.onConnetion);
	}
	private onConnetion(socket: Socket) {
		console.log('a user connected');
	}
}
