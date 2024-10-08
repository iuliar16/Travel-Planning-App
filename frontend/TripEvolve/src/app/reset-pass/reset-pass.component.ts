import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { StorageService } from '../services/storage/storage.service';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrl: './reset-pass.component.css'
})
export class ResetPassComponent {
  formGroup: FormGroup = new FormGroup({});
  token: string = ""
  password: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    this.containsUppercase(),
    this.containsNumberOrSpecial()
  ]);
  isSent: boolean = false;
  timer: any;

  containsUppercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasUppercase = /[A-Z]/.test(control.value);
      return hasUppercase ? null : { noUppercase: true };
    };
  }
  
  containsNumberOrSpecial(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasNumberOrSpecial = /[0-9\W]/.test(control.value);
      return hasNumberOrSpecial ? null : { noNumberOrSpecial: true };
    };
  }

  constructor(private router: Router,private storageService: StorageService,
     private auth: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params["token"];
    })
    this.formGroup = new FormGroup({
      password: this.password,
    });
  }


  submitForm_reset() {
    if (this.formGroup.valid) {

      this.auth.resetPassword(this.formGroup.value.password, this.token).subscribe(
        (response) => {
          this.storageService.logout();
          this.router.navigateByUrl("login");
        },
        (error) => {
          console.error('Failed to reset password!', error);
        }
      );
      
      // Show "Sent" text on the button
      this.isSent = true;

      // Reset the button after 5 seconds
      this.timer = setTimeout(() => {
        this.isSent = false;
      }, 5000);
    }
  }
}

