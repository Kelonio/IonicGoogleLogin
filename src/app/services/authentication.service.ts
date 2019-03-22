import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient} from '@angular/common/http';

import {LoginResultModel} from './../model/LoginResultModel';


const TOKEN = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);

  constructor(
      private storage: Storage,
      private plt: Platform,
      private http: HttpClient
    ) {
    this.plt.ready().then(() => {
      this.checkToken();
    });
  }
  // chequea si hay token en el storage, y setea autehtication se llama en el contructor solamente
  checkToken() {
    this.storage.get(TOKEN).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    });
  }

  login(email: string, password: string): Observable<LoginResultModel> {
      return this.http.post<LoginResultModel>('https://reqres.in/api/login', {
        email: email,
        password: password
      });
  }
  // seteamos la token en el storage
  async setToken(token: string) {
     await this.storage.set(TOKEN, 'Bearer ' + token);
     console.log('token seteada');
     this.authenticationState.next(true);
  }

  // quita la token
  async logout() {
    await this.storage.remove(TOKEN);
    this.authenticationState.next(false);
  }

  // comprueba si autentificado
  isAuthenticated() {
    return this.authenticationState.value;
  }
}
