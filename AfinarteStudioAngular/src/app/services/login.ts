import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { LoginRequest } from '../interfaces/login.request';
import { LoginResponse } from '../interfaces/login.response'; 
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { computed } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public userSignedIn = signal<User | null>(null);
  public userToken = signal<string | null>(null);

  readonly apiUrl = environment.LOGIN_URL;
  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}`, credentials);
  }

  public isAuthenticated = computed((): boolean => {
    let result=false;
    if( this.userSignedIn() && this.userToken()) {
      localStorage.setItem('userSignedIn', JSON.stringify(this.userSignedIn()));
      localStorage.setItem('userToken', this.userToken() || '');
      result = true;
    }
    return result;
  });

  private restoreSession() {
    const user = localStorage.getItem('userSignedIn');
    const token = localStorage.getItem('userToken');
    if (user && token) {
      this.userSignedIn.set(JSON.parse(user));
      this.userToken.set(token);
    }
  }

  public logout(): void {
    this.userSignedIn.set(null);
    this.userToken.set(null);
    localStorage.removeItem('userSignedIn');
    localStorage.removeItem('userToken');
  }

}
