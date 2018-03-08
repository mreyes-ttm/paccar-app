import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  httpClient: HttpClient;
  token;
  revokeUrl = 'http://localhost:8080/paccarRevoke';
  router: Router;

  constructor(router: Router, httpClient: HttpClient) {
    this.router = router;
    this.token = JSON.parse(localStorage.getItem('token_response'));
    this.httpClient = httpClient;
    this.revokeToken();
  }

  revokeToken() {
    const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + this.encodedClientIdAndSecret())
      .append('Accept', 'application/json')
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(
      {
        'token': this.token.access_token,
        'token_type_hint': 'access_token'
      }
    );

    this.httpClient
      .post(this.revokeUrl, body, { headers: headers })
      .subscribe((response: any) => {
        localStorage.removeItem('token_response');
      }, error => {
        const errorString = JSON.stringify(error);
        console.log(errorString);
      }, () => {
        this.router.navigate(['login']);
      });
  }

  encodedClientIdAndSecret() {
    return btoa(environment.clientId + ':' + environment.clientSecret);
  }
}
