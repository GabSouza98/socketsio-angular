import { Component } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
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
		private socketService: SocketService
	) { }

  onCreateUser(userName : string) {    
    this.userName = '';
    this.socketService.createUser(userName);
    this.router.navigate(['/rooms']);
  }

}
