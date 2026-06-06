import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../types/user';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from '../../environments/environment';

type registerCreds = Record<string, unknown>;

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);

  register(creds: registerCreds) {
    return this.http.post<User>(`${this.baseUrl}account/register`, creds).pipe(
      tap(user => { 
        if (user) {
          this.setCurrentUser(user);
        } else {
          console.error('Registration failed: No user returned from API');
        }   
      })
    )
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
  }

  login(creds: any) {
    return this.http.post<User>(`${this.baseUrl}account/login`, creds).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
      })
    )
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

}