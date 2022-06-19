import { Component, OnInit } from '@angular/core';
import {OAuthService, AuthConfig} from 'angular-oauth2-oidc'

export const authConfig: AuthConfig = {
  issuer: "https://dev-25120478.okta.com/oauth2/default",
  redirectUri : window.location.origin,
  clientId: "0oa5cipsvhgjpWp6T5d7"
}
@Component({
  selector: 'app-okta',
  templateUrl: './okta.component.html',
  styleUrls: ['./okta.component.scss']
})
export class OktaComponent implements OnInit {

  constructor( private oauthService:OAuthService){
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
    
  }

  ngOnInit(): void {
  }

  login(){
    this.oauthService.initImplicitFlow();
  }

  logout(){
    this.oauthService.logOut();
  }

  get getUserName(){
    const claims = this.oauthService.getIdentityClaims();
    console.log("claims",claims,this.oauthService)
    if(!claims){
      return null;
    }
    return claims;
  }

}
