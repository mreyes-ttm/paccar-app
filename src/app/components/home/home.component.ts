import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import jwtDecode = require('jwt-decode');

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  httpClient: HttpClient;
  tokenContent = '';
  logoutUrl = 'http://localhost:8080/paccarLogout';
  showTokenContent = false;
  userData;
  router: Router;

  constructor(router: Router, httpClient: HttpClient) {
    this.httpClient = httpClient;
    this.router = router;
    this.tokenContent = localStorage.getItem('token_response');
    this.userData = JSON.parse(this.tokenContent);
    if (this.userData) {
      this.showTokenContent = true;
      const expiration = new Date(jwtDecode(this.userData.id_token).exp * 1000);
      if (expiration < new Date()) {
        router.navigate(['login']);
      }
    } else {
      router.navigate(['login']);
    }
  }
  logout() {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + this.encodedClientIdAndSecret())
      .append('Accept', 'application/json')
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(
      {
        'id_token_hint': this.userData.id_token,
        'post_logout_redirect_uri': 'http://localhost:4230/logout'
      }
    );

    this.httpClient
      .post(this.logoutUrl, body, { headers: headers })
      .subscribe((response: any) => {
      }, error => {
        const errorString = JSON.stringify(error);
        console.log(errorString);
      }, () => {
        this.router.navigate(['logout']);
      });
  }

  encodedClientIdAndSecret() {
    return btoa(environment.clientId + ':' + environment.clientSecret);
  }

}
