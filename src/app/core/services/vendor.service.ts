import { HttpBackend, HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vendor } from '../models/Vendor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { UserCredential } from '../models/user-credential';

const VendorRegistrationURl = 'api/vendors/add';
const PendingUsers = 'api/vendors/pending';
const AvailableVendors = 'api/vendors/list';
const VendorLogin = 'api/vendors/login';
const ApproveVendor = 'api/vendors/updateapproved';
const RejectVendor = 'api/vendors/updaterejected';
const ResetPassword = 'api/vendors/resetVendorPassword';

export class ResetData {
  bpid: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  constructor(private httpClient: HttpClient, handler: HttpBackend) {
    /**
     * A final `HttpHandler` which will dispatch the request via browser HTTP APIs
     * directly to the backend, without going through the interceptor chain.
     */
    this.httpClient = new HttpClient(handler);
  }

  register(vendor: Vendor): Observable<any> {
    let params = new HttpParams();
    params = params.append('isTCM', 'true');
    return this.httpClient
      .post(VendorRegistrationURl, vendor, {
        params: params,
        responseType: 'text',
        observe: 'response'
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  getUsers(): Observable<any> {
    return this.httpClient
      .get(PendingUsers, {
        observe: 'response'
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  availableVendors(): Observable<any> {
    return this.httpClient
      .get(AvailableVendors, {
        observe: 'response'
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  vendorLogin(userCredential: UserCredential): Observable<any> {
    return this.httpClient
      .post(VendorLogin, userCredential, {
        // responseType: 'text',
        observe: 'response'
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  // Approve vendor Method
  approveVendor(vendorId, userName): Observable<any> {
    /* get the current url & replace the router with vendor login page */
    const URL = window.location.href.replace('vendorApproval','login');
    return this.httpClient
      .get(ApproveVendor, {
        params: {
          vendorId: vendorId,
          approvedBy: userName,
          url: URL,
        },
        observe: 'response'
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  // Reject Vendor Request
  RejectVendor(vendorId, userName) {
    return this.httpClient
      .put<any>(RejectVendor, {}, {
        params: {
          vendorId: vendorId,
          approvedBy: userName
        },
        observe: 'response'
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  resetPassword(ResetData: ResetData): Observable<any> {
    let params = new HttpParams();
    params = params.append('bpID', ResetData.bpid);
    params = params.append('oldPassword', ResetData.oldPassword);
    params = params.append('newPassword', ResetData.newPassword);
    params = params.append('confirmNewPassword', ResetData.confirmNewPassword);
    return this.httpClient
      .post(ResetPassword, {}, {
        params: params,
        responseType: 'text',
        observe: 'response'
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
}
