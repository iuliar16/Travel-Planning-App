import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from '../services/email/email.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.css'
})
export class ConfirmAccountComponent {

  token: string = ""
  email: string = ""
  isSent: boolean = false;
  timer: any;

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.authService.confirmEmail(this.email, this.token).subscribe(
        (response) => {
          console.log('user activated', response);
        },
        (error) => {
          console.error('Failed to enable user!', error);
        }
      );
    });
  }

}
