import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse, HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError, share } from 'rxjs/operators';
const ALLUSERS = 'api/users/list';
const ADDUSER = 'api/users/add';
const DELETEUSER = 'api/users/delete';
const UPDATEUSER ='api/users/update'
const ALLVENDORS = 'api/vendors/listVendors'
const ALLROLES = 'api/users/getAllTCMRoles'
const ALLTYPES='api/users/getAllTeamTypes'
const COMPANY = 'api/vendors/list'


@Injectable({
  providedIn: 'root'
})
export class UserConfigService {

  constructor(private httpClient: HttpClient) { }

    /* get ALL user details for sharing */
    getAllUsers(): Observable<any> {
      return this.httpClient.get<any>(ALLUSERS).pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        }),
      );
    }
    getAllCompany(): Observable<any> {
      return this.httpClient.get<any>(COMPANY).pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        }),
      );
    }
    getAllRoles(): Observable<any> {
      return this.httpClient.get<any>(ALLROLES).pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        }),
      );
    }
    getAllTypes(): Observable<any> {
      return this.httpClient.get<any>(ALLTYPES).pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        }),
      );
    }
    addNewUser(user): Observable<any> {

      return this.httpClient
        .post(ADDUSER, user,{
          observe: 'response',
          responseType: 'text'
        })
        .pipe(
          map((res: HttpResponse<any>) => {

            return res;
          })
        );
    }

    deleteUser(User): Observable<any> {
      return this.httpClient
        .post(DELETEUSER,User, {
          observe: 'response',
          responseType: 'text'
        })
        .pipe(
          map((res: HttpResponse<any>) => {

            return res;
          })
        );

    }
    updateUser(user,oldUserId,newEmailId): Observable<any> {
      let params = new HttpParams();
      params = params.append('oldUserId', oldUserId);
      params = params.append('newEmailId', newEmailId);
      return this.httpClient
        .post(UPDATEUSER, user,{
          params: params,
          observe: 'response',
          responseType: 'text'
        })
        .pipe(
          map((res: HttpResponse<any>) => {
            return res;
          })
        );
    }
  getAllVendors(): Observable<any> {
    return this.httpClient.get<any>(ALLVENDORS).pipe(
      map((Response: HttpResponse<any>) => {
        return Response;
      }),
    );
  }
  updateVendor(user,UserID,newEmailId): Observable<any> {
    let params = new HttpParams();
    params = params.append('oldUsername', UserID);
    params = params.append('newEmailId', newEmailId);
    return this.httpClient
      .post('api/vendors/updateVendor', user,{
        params: params,
        observe: 'response',
        responseType: 'text'
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
  deleteVendor(vendorUsername): Observable<any> {
    let params = new HttpParams();
    params = params.append('vendorUsername', vendorUsername);
    return this.httpClient
      .post('api/vendors/deleteVendor', {}, {
        params: params,
        observe: 'response',
        responseType: 'text'
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }
  addNewVendor(user): Observable<any> {
    return this.httpClient
      .post('api/vendors/addVendorFromTCMConfigPage', user,{
        observe: 'response',
        responseType: 'text'
      })
      .pipe(
        map((res: HttpResponse<any>) => {

          return res;
        })
      );
  }
}
