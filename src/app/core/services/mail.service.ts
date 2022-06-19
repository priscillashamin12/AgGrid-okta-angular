import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {MailFormat} from '../models/send-mail';
import { throwError } from 'rxjs';
const Mail_URL = '/api/email/send';
const SAVEHISTORY='/api/tcrun/saveSharedTestRunsToVendors';
@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private httpClient: HttpClient) { }

  sendMail(mailFormat: MailFormat): Observable<any> {
    return this.httpClient
      .post(Mail_URL, mailFormat, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        }),
      )
      .pipe(
        catchError((err) => {
          if (err.status === 401) {
            return throwError(
              'Your username or password is incorrect or you may not have the access permission!',
            );
          } else {
            return throwError(
              'Connection lost to the server, please contact your administrator!',
            );
          }
        }),
      );
  }
  saveShareHistory(testRunId, mailId): Observable<any> {
    return this.httpClient
      .get(SAVEHISTORY, {
        observe: 'response',
        params: {
          'testRunId': testRunId,
          'shareToMailID':mailId,
        }, 
        responseType: 'text',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
}
