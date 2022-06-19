import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpResponse, HttpClient, HttpParams } from "@angular/common/http";
import { map, catchError, share } from "rxjs/operators";
import { LoginService } from "./login.service";
import { AuthInfo } from "../models/auth-info";
import { User } from "../models/user";
const GETALLTESTPLANGROUP = "api/tcrun/getTestplanGroupNamesAnddut";
const GETTESTPLANGROUPREPORT = "api/tcrun/getTestplanReportDataNewUI";
const GETDEFECTDATA = "api/tcrun/getDefectData";
const GETBARCHARTDATA = "api/tcrun/getExecutiveReportData";
const GETTESRUNS = "api/tcrun/getTestrunsInTestplanForTPReports";
const SAVETESTRUNSELECTIONFORTPREPORT = "api/tcrun/selectrunsForTestplanReport";
@Injectable({
  providedIn: "root",
})
export class TestPlanGrpService {
  auth: AuthInfo = new AuthInfo();
  user: User = new User();
  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService
  ) {

    this.auth = this.loginService.getAuthenticatedUser();
    this.user = this.auth.user;
  }

  /* get array of test plan & device model */
  getAllTestPlanGroup() {
    let parameter = new HttpParams();
    parameter = parameter.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get<any>(GETALLTESTPLANGROUP, {
        params: parameter,
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  /* get test plan report for the selected test plan group */
  getTestPlanGroupReport(testplanGroupname, dut, exeReport) {
    let parameter = new HttpParams();
    parameter = parameter.append("testplanGroupname", testplanGroupname);
    parameter = parameter.append("dut", dut);
    parameter = parameter.append("exeReport", exeReport);
    parameter = parameter.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get<any>(GETTESTPLANGROUPREPORT, {
        params: parameter,
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  /* fetch executive report  */
  detailedExecutiveReport(dut, testPlanGroupName) {
    let parameter = new HttpParams();
    parameter = parameter.append("testplanGroupname", testPlanGroupName);
    return this.httpClient
      .get<any>(GETTESTPLANGROUPREPORT, {
        params: parameter,
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  /* get defect data */
  getDefectData(dut, testplanname) {
    let parameter = new HttpParams();
    parameter = parameter.append("testplanname", testplanname);
    parameter = parameter.append("dut", dut);
    return this.httpClient
      .get<any>(GETDEFECTDATA, {
        params: parameter,
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  /* data to plot executive summary */
  getBarChartData(testplanGroupname, dut) {
    let parameter = new HttpParams();
    parameter = parameter.append("testplanGroupname", testplanGroupname);
    parameter = parameter.append("dut", dut);
    return this.httpClient
      .get<any>(GETBARCHARTDATA, {
        params: parameter,
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  getAllTestRunFromTestPlan(testplanname, testplanGroupname) {
    let parameter = new HttpParams();
    parameter = parameter.append("testplanGroupname", testplanGroupname);
    parameter = parameter.append("testplanname", testplanname);
    return this.httpClient
      .get<any>(GETTESRUNS, {
        params: parameter,
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  updateTestRunPreference(testPlanName, testPlanGroupName, testRunList) {
    const userInfo = this.loginService.getAuthenticatedUser();
    let parameter = new HttpParams();
    parameter = parameter.append("testplanGroupname", testPlanGroupName);
    parameter = parameter.append("testplanname", testPlanName);
    parameter = parameter.append("username", userInfo.user.firstName);
    parameter = parameter.append("isAddTestruns", "false");

    return this.httpClient
      .post(SAVETESTRUNSELECTIONFORTPREPORT, testRunList, {
        responseType: "text",
        params: parameter,
        observe: "response",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
}
