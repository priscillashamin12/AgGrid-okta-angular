import {
  HttpBackend,
  HttpClient,
  HttpParams,
  HttpResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/user";
import { AuthInfo } from "../models/auth-info";
import { LoginService } from "./login.service";
const ADDTRD = 'api/trd/addTrd';
const EDITTRD = 'api/trd/editTrd';
const DELETETRD = 'api/trd/deleteTrd';
const DEVICELIST = "api/trd/listDevicemodelsForTRDCombo";
const LISTTRDS = "api/trd/listTrds";
const UPLOADTRDFILE = 'api/trd/uploadTRDExcel';
const DOWNLOADFILES = '/api/trd/downloadFileAttachment';
const getTestcaseStatusInTRD = 'api/trd/getTestcaseStatusInTRD';
const getTRDDetailsOfTestcase = 'api/tcmaster/getTRDDetailsOfTestcase';
const GETALLTCFORTRACEABILTYMATRIX = 'api/trd/getTestcaseDetailsForTraceabilityMatrix';
const GETTRDCOMMENT = "api/trd/viewTrdComments";
const DELETETRDCOMMENT = "api/trd/deleteTrdComment";
const EDITTRDCOMMENT = "api/trd/editTrdComment";
const ADDTRDCOMMENT = "api/trd/addTrdComments";
const TRDLISTFORGIVENTESTCASE = 'api/trd/getTrdIDListBasedOnTestCaseID';

@Injectable({
  providedIn: "root",
})
export class TrdService {
  auth: AuthInfo = new AuthInfo();
  user: User = new User();
  constructor(private httpClient: HttpClient, handler: HttpBackend,
    private loginservice: LoginService) {
    this.httpClient = new HttpClient(handler);
    this.auth = this.loginservice.getAuthenticatedUser();
    this.user = this.auth.user;
  }

  getDeviceList(): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient.get<any>(DEVICELIST, {
      params: params,
    }).pipe(
      map((res: HttpResponse<any>) => {
        return res;
      })
    );
  }

  getAllTrdList(deviceModel): Observable<any> {
    let params = new HttpParams();
    params = params.append("deviceModel", deviceModel);
    params = params.append("teamType", this.auth.accessTeamType);

    return this.httpClient
      .get<any>(LISTTRDS, {
        params: params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  addNewTrd(trdID, deviceModels, attachments): Observable<any> {
    let params = new HttpParams();
    params = params.append('trdID', trdID);
    params = params.append('deviceModels', deviceModels);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .post(ADDTRD, attachments, {
        params: params,
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response['body'];
        })
      );
  }

  editTrd(trdIDToEdit, newTRDid, deviceModels, filesBody): Observable<any> {
    let params = new HttpParams();
    params = params.append('trdIDToEdit', trdIDToEdit)
    params = params.append('newTRDid', newTRDid);
    params = params.append('deviceModels', deviceModels);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .post(EDITTRD, filesBody, {
        observe: 'response',
        responseType: 'text',
        params: params,
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response['body'];
        })
      );
  }

  deleteTrd(trdIDtoDelete): Observable<any> {
    let params = new HttpParams();
    params = params.append('trdIDtoDelete', trdIDtoDelete);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .post(DELETETRD, {}, {
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
  uploadReport(formData): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .post(UPLOADTRDFILE, formData, {
        observe: 'response',
        params: params,
        responseType: 'text',
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response['body'];
        })
      );
  }

  downloadTrdAttachments(trdId, fileName) {
    const httpParams = new HttpParams()
      .set('trdID', trdId)
      .set('filename', fileName);
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get(DOWNLOADFILES, { responseType: 'blob' as 'blob', observe: 'response', params: httpParams });
  }

  getTestCasesInTrd(trdID, selectedDeviceModel) {
    let params = new HttpParams();
    params = params.append('trdID', trdID);
    params = params.append('selectedDeviceModel', selectedDeviceModel);
    return this.httpClient
      .get(getTestcaseStatusInTRD, {
        params: params,
        observe: 'response',
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  getTRDDetailsOfTestcase(testcaseId) {
    let params = new HttpParams();
    params = params.append('testcaseId', testcaseId);
    return this.httpClient
      .get(getTRDDetailsOfTestcase, {
        params: params,
        observe: 'response',
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  getTrdIDListBasedOnTestCaseID(testcaseID): Observable<any> {
    return this.httpClient
      .post(TRDLISTFORGIVENTESTCASE, testcaseID, {
        observe: 'response',
        // responseType: 'text',
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response['body'];
        })
      );
  }

  getAllTCForTraceabilityMatrix(testcaseID, deviceModels, trdID): Observable<any> {
    let params = new HttpParams();
    params = params.append('testcaseID', testcaseID);
    params = params.append('deviceModel', deviceModels);
    params = params.append('trdID', trdID);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient.get<any>(GETALLTCFORTRACEABILTYMATRIX,
      {
        params: params,
      }).pipe(
        map((res: HttpResponse<any>) => {
          return res;
        }),
      );

  }

  getAllTRDComments(trdId) {
    let params = new HttpParams();
    params = params.append("trdId", trdId);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get<any>(GETTRDCOMMENT, {
        params: params,
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res['body'];
        })
      );
  }

  editTRDComment(postBody) {
    return this.httpClient
      .post(EDITTRDCOMMENT, postBody, {
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response['body'];
        })
      );
  }

  addTRDComment(postBody) {
    return this.httpClient
      .post(ADDTRDCOMMENT, postBody, {
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response['body'];
        })
      );
  }

  deleteTRDComment(postBody) {
    return this.httpClient
      .post(DELETETRDCOMMENT, postBody, {
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response['body'];
        })
      );
  }
}
