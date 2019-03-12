import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from './../services/authentication.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  /* usuario y contraseña de prueba de la pagina https://reqres.in/ */
  email = 'peter@klaven';
  password = 'cityslicka';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
  }

  tryLogin() {
    this.authenticationService.login(
      this.email,
      this.password
    )
      .subscribe(
        r => {
          if (r.token) {
            this.authenticationService.setToken(r.token);
            this.router.navigateByUrl('/profile');
          }
        },
        r => {
          alert(r.error.error);
        });
  }

}
