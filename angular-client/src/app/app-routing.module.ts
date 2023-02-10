import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [    
  { path: '', component: LoginComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'room/:name', component: ChatComponent },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
