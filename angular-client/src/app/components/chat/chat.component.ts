import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service'; 
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message : string = '';
  messages : string[] = [];
  roomName : string = '';

  constructor(
		private socketService: SocketService,
    private route: ActivatedRoute,
    private router: Router,
	) { }

  onSendMessage(message : string) {
    if (message === "") return;  

    this.socketService.sendMessage(message, this.roomName);
    this.message = '';
  }

  leaveRoom() {
    this.socketService.leaveRoom(this.roomName);
  }

  ngOnInit() {
    this.roomName = this.route.snapshot.paramMap.get('name')!;
    this.socketService.joinRoom(this.roomName);
    this.socketService.onReceiveMessage().subscribe( (data:string) => {
      this.messages.push(data);
    }
  );
  }

}
