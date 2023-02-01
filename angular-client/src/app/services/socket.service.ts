import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  // emit event
	fetchRooms() {
		this.socket.emit("fetch-rooms");
	} 

	// listen event
	onFetchRooms() {
		return this.socket.fromEvent<string[]>("update-rooms");
	}

  joinRoom(room : string) {
    this.socket.emit("join-room", room);
  }

  leaveRoom(room : string) {
    this.socket.emit("leave-room", room);
  }

  sendMessage(message : string, room : string) {
    this.socket.emit("send-message", message, room);
  }

  onReceiveMessage() {
		return this.socket.fromEvent<string>("receive-message");
	}

  createRoom(room : string) {
    this.socket.emit("create-room", room);
  }

}
