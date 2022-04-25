import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { AuthenticationService } from '../service/authentication.service';
import { User } from '../service/model/user';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  public showLoading: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private router:Router, private authenticationService: AuthenticationService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()){
      this.router.navigateByUrl('/employee/management');
    }
  }

  public onRegister(user:User):void {
    this.showLoading = true;
    console.log(user);
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe(
        (respose:User) =>{
          this.showLoading = false;
          this.sendNotification(NotificationType.Success,`A new account has been created for ${ respose.firstName },
           Please check your email for password to login`);

        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.sendNotification(NotificationType.Error, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    )
  }
  private sendNotification(notificationType: NotificationType, message: string): void {
    if(message) {
      this.notificationService.notify(notificationType, message);
    }else{
      this.notificationService.notify(notificationType, 'An error occured, please try again');
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
