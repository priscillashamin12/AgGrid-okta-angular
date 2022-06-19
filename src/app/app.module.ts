import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AgGridModule } from 'ag-grid-angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from "./app-routing.module";
import { FeaturesComponent } from './features/features.component';
import { SharedModule } from './shared/shared.module';
import {OAuthModule} from 'angular-oauth2-oidc';
import { OktaComponent } from './okta/okta.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AgGirdComponent } from './ag-gird/ag-gird.component';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';
import { AgGirdHelperComponent } from './ag-gird/ag-gird-helper/ag-gird-helper.component';
var licenseKey =
    'CompanyName=Discovery,' +
    'LicensedGroup=Discovery- Content Systems,' +
    'LicenseType=MultipleApplications,' +
    'LicensedConcurrentDeveloperCount=4,' +
    'LicensedProductionInstancesCount=0,' +
    'AssetReference=AG-018148,' +
    'ExpiryDate=21_October_2022_[v2]_MTY2NjMwNjgwMDAwMA==1b06726002041cb8ef7d96fb106601e1';
LicenseManager.setLicenseKey(licenseKey);

@NgModule({
 declarations: [
   AppComponent,
   FeaturesComponent,
   OktaComponent,
   AgGirdComponent,
   AgGirdHelperComponent,
 ],
 imports: [
   BrowserModule,
   HttpClientModule,
   AgGridModule,
   AppRoutingModule,
   SharedModule,
   BrowserAnimationsModule,
   FormsModule,
   OAuthModule.forRoot()
 ],
 providers: [],
   schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
 bootstrap: [AppComponent]
})
export class AppModule { }