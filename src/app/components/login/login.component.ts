import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import jwtDecode = require('jwt-decode');

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  paccarUrl: string = 'https://www-cert.epaccar.com/PortalSSO/connect/authorize?' +
  'scope=openid eportal email' +
  '&response_type=code' +
  '&redirect_uri=http%3A%2F%2Flocalhost%3A4230%2Fcallback' +
  '&client_id=';

  constructor(public router: Router) {
    const userData = JSON.parse(localStorage.getItem('token_response'));
    if (userData) {
      const expiration = new Date(jwtDecode(userData.id_token).exp * 1000);
      if (expiration > new Date()) {
        router.navigate(['home']);
      } else {
        localStorage.removeItem('token_response');
      }
    }
  }

  codeRequest() {
    window.location.href = this.paccarUrl + environment.clientId;
  }
}
