import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { RoomsComponent } from './components/rooms/rooms.component';

const routes: Routes = [    
  { path: '', component: RoomsComponent },
  { path: 'room/:name', component: ChatComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
