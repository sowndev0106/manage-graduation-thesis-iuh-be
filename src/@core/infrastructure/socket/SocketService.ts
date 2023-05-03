import { Server } from 'socket.io';
class SocketService {
	private static socket: Server;
	static initSocket(socket: Server) {
		this.socket = socket;
	}
}
export default SocketService;
