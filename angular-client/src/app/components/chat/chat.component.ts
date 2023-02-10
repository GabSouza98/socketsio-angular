import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service'; 
import { SharedService } from 'src/app/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/models/rooms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  message : string = '';
  messages : Message[] = [];
  roomName : string = '';
  userName : string = '';

  constructor(
		private socketService: SocketService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
	) { }

  onSendMessage(message : string) {
    if (message === "") return;  
    this.socketService.sendMessage(message, this.roomName, this.userName);
    this.message = '';
  }

  leaveRoom() {
    this.socketService.leaveRoom(this.roomName);
  }

  ngOnInit() {

    let userName = this.sharedService.getUserName();
    if(userName) {
      this.userName = userName; 
    } else {
      this.router.navigate(['']);
    }

    this.roomName = this.route.snapshot.paramMap.get('name')!;
    this.socketService.joinRoom(this.roomName);

    this.socketService.onReceiveMessage().subscribe( (data: Message) => {
      this.messages.push(data);
      }
    );
    
    this.socketService.fetchMessages(this.roomName);
    this.socketService.onFetchMessages().subscribe( (data: Message[]) => {
      if(this.messages.length === 0) {
        this.messages = data;
      }
    })
  }

}
