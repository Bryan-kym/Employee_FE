import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderType } from '../enum/header-type.enum';
import { NotificationType } from '../enum/notification-type.enum';
import { AuthenticationService } from '../service/authentication.service';
import { User } from '../service/model/user';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy{
  public showLoading: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private router:Router, private authenticationService: AuthenticationService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()){
      this.router.navigateByUrl('/employee/management');
    }else{
      this.router.navigateByUrl('/login');
    }
  }

  public onLogin(user:User):void {
    this.showLoading = true;
    console.log(user);
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe(
        (respose:HttpResponse<User>) =>{
          const token = respose.headers.get(HeaderType.JWT_TOKEN);
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToLocalCache(respose.body);
          this.router.navigateByUrl('/employee/management');
          this.showLoading = false;
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.sendErrorNotification(NotificationType.Error, errorResponse.error.message);
          this.showLoading = false;
        }
      )
    )
  }
  private sendErrorNotification(notificationType: NotificationType, message: string): void {
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
