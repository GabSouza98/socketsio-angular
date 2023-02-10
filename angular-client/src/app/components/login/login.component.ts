import { Component } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { SharedService } from 'src/app/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  userName : string = '';  

  constructor(
    private router: Router,
		private socketService: SocketService,
    private sharedService: SharedService
	) { }

  onCreateUser(userName : string) {    
    this.userName = '';
    this.socketService.createUser(userName); //create user at DB via socket
    this.sharedService.setUserName(userName); //send userName to Rooms component
    this.router.navigate(['/rooms']);
  } 

}
