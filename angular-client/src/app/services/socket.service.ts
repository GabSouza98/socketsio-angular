import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  
import { Message, Room } from '../models/rooms';

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
		return this.socket.fromEvent<Room[]>("update-rooms");
	}

  joinRoom(room : string) {
    this.socket.emit("join-room", room);
  }

  leaveRoom(room : string) {
    this.socket.emit("leave-room", room);
  }

  sendMessage(message : string, room : string, user : string) {
    this.socket.emit("send-message", message, room, user);
  }

  onReceiveMessage() {
		return this.socket.fromEvent<Message>("receive-message");
	}

  fetchMessages(room : string) {
    this.socket.emit("fetch-messages", room);
  }

  onFetchMessages() {
    return this.socket.fromEvent<Message[]>("update-messages");
  }

  createRoom(room : string) {
    this.socket.emit("create-room", room);
  }

  createUser(user : string) {
    this.socket.emit("create-user", user);
  }

  deleteRoom(room : string) {
    this.socket.emit("delete-room", room);
  }

}
