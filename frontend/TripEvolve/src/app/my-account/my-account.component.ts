import { Component } from '@angular/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {
  utilizator = {
    username: 'username',
    firstname: 'Prenume',
    lastname: 'Nume',
    email: 'email@example.com',
    rank: 'Rank Prestabilit',
  };
}
