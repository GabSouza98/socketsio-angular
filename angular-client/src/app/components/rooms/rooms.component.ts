import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service'; 
import { SharedService } from 'src/app/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Room } from 'src/app/models/rooms';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent {

  roomName : string = '';
  rooms : Room[] = [];  
  userName : string = '';

  constructor(
		private socketService: SocketService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private router: Router,
	) { }

  onCreateRoom(roomName : string) {    
    this.roomName = '';
    // this.router.navigate(['/room', roomName]);
    this.socketService.createRoom(roomName);
  }

  onDeleteRoom(roomName: string) {   
    this.socketService.deleteRoom(roomName);
  }

  notEmpty(room : Room) {
    return room.users.length > 0;
  }

	ngOnInit(): void {

    let userName = this.sharedService.getUserName();
    if(userName) {
      this.userName = userName; 
    } else {
      this.router.navigate(['']);
    }

    this.socketService.fetchRooms();
    this.socketService.onFetchRooms().subscribe((data:Room[]) => {
        this.rooms = data;        
      }
    );      
	} 

}
