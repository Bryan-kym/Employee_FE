import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './model/user';
import { CustomHttpresponse } from './model/custom-http-response';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.appUrl;

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[] | HttpErrorResponse> {
    return this.http.get<User[]>(`${this.host}/user/list`);
  }

  public addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/add`,formData);
  }

  public updateUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update`,formData);
  }

  public resetPassword(email: string): Observable<CustomHttpresponse | HttpErrorResponse> {
    return this.http.get<CustomHttpresponse>(`${this.host}/user/resetpassword/${email}`);
  }

   public updateProfileImage(formData: FormData): Observable<HttpEvent<User> | HttpErrorResponse> {
    return this.http.post<User>(`${this.host}/user/updateProfileImage`,formData,{reportProgress:true,observe:'events'});
   }

   public deleteUser(userId: number): Observable<CustomHttpresponse | HttpErrorResponse> {
    return this.http.delete<any>(`${this.host}/user/delete/${userId}`);
   }

   public addUserToLocalCache(users: User[]): void {
    localStorage.setItem('users',JSON.stringify(users));
   }

   public getUserFromLocalCache(): User {
    if (localStorage.getItem('users')){
      return JSON.parse(localStorage.getItem('users'));
   }
   return null;
  }

  public createUserFormDate(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername',loggedInUsername);
    formData.append('firstName',user.firstName);
    formData.append('lastName',user.lastName);
    formData.append('lastName',user.department);
    formData.append('email',user.email);
    formData.append('isActive',JSON.stringify(user.isActive));
    formData.append('isNotLocked',JSON.stringify(user.isNotLocked));
    formData.append('mobile',JSON.stringify(user.mobile));
    formData.append('nid',JSON.stringify(user.nid));
    formData.append('lastName',user.position);
    formData.append('profileImage',profileImage);
    formData.append('role',user.roles);
    formData.append('username',user.username);
    return formData;
  }
  
}
