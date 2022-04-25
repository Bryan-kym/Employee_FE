import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { NotificationType } from '../enum/notification-type.enum';
import { Role } from '../enum/role.enum';
import { AuthenticationService } from '../service/authentication.service';
import { CustomHttpresponse } from '../service/model/custom-http-response';
import { FileUploadStatus } from '../service/model/file-upload.status';
import { User } from '../service/model/user';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
private titleSubject = new BehaviorSubject<string>('Users');
public titleAction$ = this.titleSubject.asObservable();
public users: User[];
public user: User;
public refreshing :boolean;
public selectedUser: User;
private subscriptions: Subscription[] = [];
public fileName: string;
public profileImage: File;
public val1: string;
public val2: File;
public active :boolean;
public notLocked: boolean;
public val3 :boolean;
public val4: boolean;
public isActive: boolean;
public editUser = new User();
private currentusername: string;
public fileStatus = new FileUploadStatus();
private position : string;




  constructor(private userService: UserService, private notificationService: NotificationService, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.getUsers(true);
    this.user = this.authenticationService.getUserFromLocalCache();
  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subscriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) =>{
          this.userService.addUserToLocalCache(response);
          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.Success, `${response.length} user(s)  loaded successfully.`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.Error, errorResponse.error.message);
          this.refreshing= false;
        }
      )
    );
  }

  public onSelectUser(selectedUser: User):void {
    this.selectedUser = selectedUser;
    this.clickButton('openUserInfo');
  }

  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.currentusername = editUser.username;
    this.clickButton('openUserEdit');
  }

  public onProfileImgChange(fileName: string, profileImage: File): void{
    this.fileName = fileName;
    this.profileImage = profileImage;
    this.val1= (event.target as HTMLInputElement).files[0].name;
    this.val2=  (event.target as HTMLInputElement).files[0];
  }

  public saveNewUser(): void {
    this.clickButton('new-user-save');
  }

  public onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFormDate(null, userForm.value, this.profileImage);
    this.subscriptions.push(
    this.userService.addUser(formData).subscribe(
      (response: User) => {
        this.clickButton('new-user-close');
        this.getUsers(false);
        this.fileName= null;
        this.profileImage = null;
        userForm.reset();
        this.sendNotification(NotificationType.Success, `${response.firstName} ${response.lastName} registered successsfully`);
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.Error, errorResponse.error.message);
      }
    )
    );
  }

  // public onSelectedCheckbox(value:boolean): void {
  //   this.isActive = value;
  // }

  public onDeleteUser(username: string): void {
    this.subscriptions.push(
      this.userService.deleteUser(username).subscribe(
        (response: CustomHttpresponse) => {
          this.sendNotification(NotificationType.Success, response.message);
          this.getUsers(true);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.Error, errorResponse.error.message);
        }
      )
    );
  }

  public searchUsers(searchTerm: string): void {
    const results: User[] = [];
    for (const users of this.userService.getUserFromLocalCache()) {
      if (users.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        users.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        users.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ) {
        results.push(users);
      }
    }
    this.users = results;
    if (results.length === 0 || !searchTerm) {
      this.users = this.userService.getUserFromLocalCache();
    }
  }

  public onUpdateUser(): void {
    const formData = this.userService.createUserFormDate(this.currentusername, this.editUser, this.profileImage);
    this.subscriptions.push(
    this.userService.updateUser(formData).subscribe(
      (response: User) => {
        this.clickButton('closeEditUserModalButton');
        this.getUsers(false);
        this.fileName= null;
        this.profileImage = null;
        this.sendNotification(NotificationType.Success, `${response.firstName} ${response.lastName} updated successsfully`);
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.Error, errorResponse.error.message);
      }
    )
    );
  }

  public onUpdateCurrentUser(user: User): void {
    this.refreshing = true;
    this.currentusername = this.authenticationService.getUserFromLocalCache().username;
    const formData = this.userService.createUserFormDate(this.currentusername, user, this.profileImage);
    this.subscriptions.push(
    this.userService.updateUser(formData).subscribe(
      (response: User) => {
        this.authenticationService.addUserToLocalCache(response);
        this.getUsers(false);
        this.fileName= null;
        this.profileImage = null;
        this.sendNotification(NotificationType.Success, `${response.firstName} ${response.lastName} updated successsfully`);
      },
      (errorResponse: HttpErrorResponse) => {
        this.sendNotification(NotificationType.Error, errorResponse.error.message);
        this.refreshing = true;
        this.profileImage = null;
      }
    )
    );
  }

  public onLogout(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
    this.sendNotification(NotificationType.Success, `You've been successfully logged out`);
  }

  public updateProfileImage(): void {
    this.clickButton('profile-image-input');
  }

  public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage);
    this.subscriptions.push(
      this.userService.updateProfileImage (formData).subscribe(
        (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.Error, errorResponse.error.message);
          this.fileStatus.status = 'done';
        }
      )
      );
  }
  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(100 * event.loaded / event.total);
        this.fileStatus.status = 'progress';
      break;
      case HttpEventType.Response:
        if(event.status === 200) {
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.sendNotification(NotificationType.Success, `${event.body.firstName}\'s image updated succesfully`);
          this.fileStatus.status = 'done';
          break;
        }else{
          this.sendNotification(NotificationType.Error, `Unable to upload image. Please try again`);

      break;
        }
      default:
        `Finished all processes`;
    }
  }


  public onResetPassword(emailForm: NgForm): void {
    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subscriptions.push( 
      this.userService.resetPassword(emailAddress).subscribe(
        (response: CustomHttpresponse) => {
          this.sendNotification(NotificationType.Success, response.message);
          this.refreshing = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.Warning, errorResponse.error.message);
          this.refreshing = false;
        },
        () => emailForm.reset()
      )
    );
  }

  public isUnchanged(user: User): void {
    this.position = this.authenticationService.getUserFromLocalCache().position;
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN;
  }
  public get isUser(): boolean {
    return this.getUserRole() === Role.USER;
  }
  public get isHR2(): boolean {
    return this.getUserRole() === Role.HR;
  }
  public get isManager1(): boolean {
    return this.getUserRole() === Role.MANAGER;
  }

  public get isManager(): boolean {
    return this.getUserRole() === Role.MANAGER || this.isAdmin;
  }

  public get isHR(): boolean {
    return this.getUserRole() === Role.HR || this.isAdmin || this.isManager;
  }

  public get isHR1(): boolean {
    return this.getUserRole() === Role.HR || this.isAdmin;
  }

  public get isFinance(): boolean {
    return this.getUserRole() === Role.FINANCE || this.isAdmin || this.isManager;
  }

  public get isFinance1(): boolean {
    return this.getUserRole() === Role.FINANCE;
  }


  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().roles;
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if(message) {
      this.notificationService.notify(notificationType, message);
    }else{
      this.notificationService.notify(notificationType, 'An error occured, please try again');
    }
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}