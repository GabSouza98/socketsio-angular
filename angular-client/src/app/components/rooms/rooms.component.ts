import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service'; 
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {

  roomNames : string[] = [];
  roomName : string = '';

  constructor(
		private socketService: SocketService,
    private route: ActivatedRoute,
    private router: Router,
	) { }

  onCreateRoom(roomName : string) {
    // this.socketService.joinRoom(roomName);
    this.roomName = '';
    // this.router.navigate(['/room', roomName]);
    this.socketService.createRoom(roomName);
  }

	ngOnInit(): void {
    this.socketService.fetchRooms();
    this.socketService.onFetchRooms().subscribe( (data:any) => {
        this.roomNames = data;
      }
    );

	} 
}
