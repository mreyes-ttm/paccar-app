import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import jwt = require('jsonwebtoken');

@Component({
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})

export class CallbackComponent {

  tokenUrl = 'http://localhost:8080/paccarLogin';
  httpClient: HttpClient;
  router: Router;
  paccarPem = ''
  + '-----BEGIN CERTIFICATE-----'
  +'MIIFUDCCBDigAwIBAgITFgAAmNUNZ4iRjdkxgQAAAACY1TANBgkqhkiG9w0BAQsF'
  +'ADBJMRMwEQYKCZImiZPyLGQBGRYDY29tMRYwFAYKCZImiZPyLGQBGRYGcGFjY2Fy'
  +'MRowGAYDVQQDExFQQUNDQVJJU1NVRUNBMTYwMTAeFw0xNzAyMDgxODQ5MTRaFw0x'
  +'OTAyMDgxODQ5MTRaMIGlMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3Rv'
  +'bjEPMA0GA1UEBxMGUmVudG9uMQ8wDQYDVQQKEwZQQUNDQVIxDzANBgNVBAsTBlBB'
  +'Q0NBUjEZMBcGA1UEAxMQenpCaXp2aWxsZVBvclNTTzEzMDEGCSqGSIb3DQEJARYk'
  +'enpCaXp2aWxsZVBvclNTT0BiaXp2aWxsZS5wYWNjYXIuY29tMIIBIjANBgkqhkiG'
  +'9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxW9cb5ls08Co44W/+sdQC/d3jmEN89TwFM8e'
  +'pp7HVqXdLhEN9ISeJ2r6FjTEWPAVMFNI5ZDu5uIvmD2avMG0xlCWeb56fD3l0YqN'
  +'yVOjdFZkxynk2pY3CPKpjtfH4TvAuCRO1PdOifyZx4s+ebyuawL9PUgdA7xiGrno'
  +'HRgqUhvsg3aMHIr+3dY2UXLBZm8UEa2OeMB5jUTe4J+DlDpt98/6OE/oqg24zbsa'
  +'myXwelzM3dVeBzsCYmf4acsH4vdhGbFxi4eYQGpyRWBsVMEGpZB3t9QXzC8VhDUp'
  +'DcFzD4V1CmSXGkWvUJZwBakKT0c89egDmzig4HGxEHwiC0xT6QIDAQABo4IB0jCC'
  +'Ac4wCwYDVR0PBAQDAgWgMDwGCSsGAQQBgjcVBwQvMC0GJSsGAQQBgjcVCIefnD+B'
  +'8eJrg/2TMISttEGDmPhGQpzIc4fPymoCAWQCAQswRAYJKoZIhvcNAQkPBDcwNTAO'
  +'BggqhkiG9w0DAgICAIAwDgYIKoZIhvcNAwQCAgCAMAcGBSsOAwIHMAoGCCqGSIb3'
  +'DQMHMB0GA1UdDgQWBBSbVDlX1k2JkTaGb+WJWvv4pzbixzAfBgNVHSMEGDAWgBQh'
  +'JhpPZceJNvlgbvx1zcfrkL2j/zA8BgNVHR8ENTAzMDGgL6AthitodHRwOi8vcGtp'
  +'LnBhY2Nhci5jb20vUEFDQ0FSSVNTVUVDQTE2MDEuY3JsMIGKBggrBgEFBQcBAQR+'
  +'MHwwUQYIKwYBBQUHMAKGRWh0dHA6Ly9wa2kucGFjY2FyLmNvbS9wYWNjYXJvY2Ex'
  +'Nm4yMC5wYWNjYXIuY29tX1BBQ0NBUklTU1VFQ0ExNjAxLmNydDAnBggrBgEFBQcw'
  +'AYYbaHR0cDovL29jc3AucGFjY2FyLmNvbS9vY3NwMBMGA1UdJQQMMAoGCCsGAQUF'
  +'BwMCMBsGCSsGAQQBgjcVCgQOMAwwCgYIKwYBBQUHAwIwDQYJKoZIhvcNAQELBQAD'
  +'ggEBAD503pwtkp/ZHuSYWEyMRWtyS7Nzs5BQ5xkrAfthO2GKStmvRrWlx+AJxEy1'
  +'GOBJ/pBPfD0N4w1bhDalBDx7js3J6h2Kztx0zgEIZ7hgW4WwqdZTkD1ZqlM+YQTF'
  +'FT+At/rDgN0lQ5I60+I4k12jCt9VW/N6u8ZD4ewiu2AhzmPt3kYHCoCJO+w0h/Fe'
  +'7GlVXAzyWMLgeG1Tyh26Ew2CdOA6DT+0qCVsc9u7HEXJdc7+sFn0L/bCeljEnhKR'
  +'nc5+2IKQSoi4X4uo0B84Zyl+boZVaXu3OYojBBA4zyFnI/IAZ8YrzN8wDtCi8YBt'
  +'wvSk/LgO4J3QOriRGPXrB+Jgbig='
  + '-----END CERTIFICATE-----'
  ;
  bypassSignatureValidation = true;

  constructor(router: Router, httpClient: HttpClient) {
    this.router = router;
    this.httpClient = httpClient;
    const params = router.routerState.snapshot.url.split('?')[1].split('&');
    const codeKeyValue = params[0].split('=');
    const code = codeKeyValue[1];
    this.tokenRequest(code);
  }

  tokenRequest(code: string) {

    const headers = new HttpHeaders()
      .append('Authorization', 'Basic ' + this.encodedClientIdAndSecret())
      .append('Accept', 'application/json')
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(
      {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'http://localhost:4230/callback',
        'client_id': environment.clientId,
        'client_secret': environment.clientSecret,
        'tenantDomain': ' www-cert.epaccar.com'
      }
    );
    this.httpClient
      .post(this.tokenUrl, body, { headers: headers })
      .subscribe((response: any) => {
        const userData = response;
        const isValid = this.validateSignature(userData.id_token);
        if (isValid || this.bypassSignatureValidation) {
          localStorage.setItem('token_response', JSON.stringify(userData));
          this.router.navigate(['home']);
        }
      }, error => {
        const errorString = error.toString();
        console.log(errorString);
        this.router.navigate(['login']);
      });
  }

  encodedClientIdAndSecret() {
    return btoa(environment.clientId + ':' + environment.clientSecret);
  }

  validateSignature(jwtSignature: string) {
    let isValid = true;
    jwt.verify(jwtSignature, this.paccarPem, { algorithms: [ 'RS256' ], ignoreExpiration: true }, function(err) {
      if (err) {
        console.log(err);
        isValid = false;
      }
    });
    return isValid;
  }
}
