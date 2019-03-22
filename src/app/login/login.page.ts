import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from './../services/authentication.service';

import { LoadingController, AlertController, Platform } from '@ionic/angular';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

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
    private authenticationService: AuthenticationService,
    private googlePlus: GooglePlus,
    private nativeStorage: NativeStorage,
    private platform: Platform,
    public loadingController: LoadingController,
    public alertController: AlertController
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

  /* esta es la parte de intento de login con google */

  async doGoogleLogin() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    this.googlePlus.login({
      'scopes': '', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      // tslint:disable-next-line:max-line-length
      'webClientId': '223418638526-mil3a2e317qa5utbnu8ifdspnhlms21k.apps.googleusercontent.com', // environment.googleWebClientId, // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
       // tslint:disable-next-line:max-line-length
      'offline': true, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      })
      .then(user => {
        // save user data on the native storage

        this.presentMessage('El mail del usuario logeado' + user.email);
        this.nativeStorage.setItem('google_user', {
          name: user.displayName,
          email: user.email,
          picture: user.imageUrl
        })
        .then(() => {
           // realmente con google no hay token            this.authenticationService.setToken('12341234143');
           this.router.navigate(['/profile']);
        }, (error) => {
          console.log(error);
        });
        loading.dismiss();
      }, err => {
        console.log(err);
        this.presentMessage('Error' + err);
        if (!this.platform.is('cordova')) {
          this.presentAlert();
        }
        loading.dismiss();
      });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
       message: 'Cordova is not available on desktop. Please try this in a real device or in an emulator.',
       buttons: ['OK']
     });

    await alert.present();
  }

  async presentMessage(message) {
    const alert = await this.alertController.create({
       message: message,
       buttons: ['OK']
     });

    await alert.present();
  }


  async presentLoading(loading: HTMLIonLoadingElement) {
    return await loading.present();
  }


}
