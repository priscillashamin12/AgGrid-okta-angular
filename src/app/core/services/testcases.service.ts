import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import {
  HttpResponse,
  HttpClient,
  HttpParams,
  HttpHeaders,
} from "@angular/common/http";
import { map } from "rxjs/operators";
import { LoginService } from "./login.service";
import { User } from "../models/user";
import { AuthInfo } from "../models/auth-info";
const UNMAPPEDLIST = "/api/tcmaster/getUnmappedTestcases";
const UNMAPPEDLISTWITHSTEPS = "/api/tcmaster/getUnmappedTestcasesWithTeststep";
const MAPPEDLISTWITHSTEPS = "/api/tcmaster/getMappedTestcaseswithteststeps";
const GETALLURL = "api/tcmaster/getallmodules";
const MAPPEDLIST = "/api/tcmaster/getMappedTestcases";
const TESTSTEPS_IN_MAPPEDTC = "/api/tcmaster/getTeststepsOfTestcase";
const VIEWTESTCASES = "api/tcmaster/findByModulePathandPriority";
const GETESTCASEDETAILS = "api/tcmaster/getByTestcaseId";
const TESTCASES_UNDER_DEVELOPMENT =
  "api/tcmaster/getTestcasesByLastmodifiedDate";
const MODULE_PATH_LIST = "api/tcmModulpath/getall";
const GETTCPRIORITYURL = "api/tcmaster/gettotalTestcasespriority";
const SETASDEFAULTURL = "api/users/saveVisualPreference";
const GETALLTP = "api/testsuitelist/getallTestplans";
const ADDTOTESTPLAN = "api/tcmaster/addTestplanToTestcaseids";
const GETAPPROVETESTCASEURL = "api/tcmaster/approveTestcase";
const ALLUNMAPEDGRPS = "/api/tcmaster/getallgroups";
const DELETEBUBBLE = "api/tcmaster/deletePathBubblesByName";
const EDITBUBBLE = "/api/tcmaster/editunmappedgroup";
const ADDBUBBLE = "/api/tcmaster/saveunmappedgroup";
const SAVEMODULEPATH = "api/tcmModulpath/saveModulepath";
const GETDATAFORMAPPING = "api/tcmModulpath/getDataForBubbles";
const GETMODULEPATH = "/api/tcmaster/getModulepathByTestcaseId";
const ADDPATH = "/api/tcmaster/addpath";
const GETAC = "api/jira/acceptanceCriteria";
const updateTCfromUI = "api/tcmaster/updateTCfromUI";
const getALMAdditionalFields = "api/tcmaster/getALMAdditionalFields";
const getALMDropdown = "api/tcmaster/getALMDropdown";
@Injectable({
  providedIn: "root",
})
export class TestcasesService {
user: User = new User();
auth: AuthInfo = new AuthInfo();
  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService
  ) {
    this.auth = this.loginService.getAuthenticatedUser();
    this.user = this.auth.user;
  }

  getAllForExport(): Observable<any> {
    return this.httpClient
      .get("api/tcrun/getExcelValues", {
        observe: "response",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
  
  /* Set user's visualisation preference */
  setAsdefault(userPreference): Observable<any> {
    let params = new HttpParams();
    const UserInfo = this.loginService.getAuthenticatedUser();
    params = params.append("ntid", UserInfo.user.userName);
    params = params.append("teamType", this.auth.accessTeamType);
    if (UserInfo.user.vendorId !== null) {
      params = params.append("isUser", "false");
    } else {
      params = params.append("isUser", "true");
    }
    return this.httpClient
      .post(SETASDEFAULTURL, [userPreference], {
        params: params,
        responseType: "text",
        observe: "response",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
  getAllGrouping(): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient.get<any>(GETALLURL, {
      params: params,
    }).pipe(
      map((res: HttpResponse<any>) => {
        const response = res as any;
        let ID = 1;
        return response;
      })
    );
  }
  approveTestCase(isApproved, testCaseId, comments, existingFilesList) {
    const requestBody = {
      testcaseId: testCaseId.toString(),
      isApproved: isApproved,
      comments: comments.toString(),
      existingFilesList: existingFilesList,
    };
    return this.httpClient
      .post(GETAPPROVETESTCASEURL, requestBody, {
        observe: "response",
        responseType: "text",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  unMappedTestCases(): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient.get<any>(UNMAPPEDLIST, {
      params: params,
    }).pipe(
      map((Response: HttpResponse<any>) => {
        return Response;
      })
    );
  }
  unMappedTestCasesWithTestSteps(): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient.get<any>(UNMAPPEDLISTWITHSTEPS, {
      params: params,
    }).pipe(
      map((Response: HttpResponse<any>) => {
        return Response;
      })
    );
  }
  mappedTestCasesWithTestSteps(): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient.get<any>(MAPPEDLISTWITHSTEPS, {
      params: params,
    }).pipe(
      map((Response: HttpResponse<any>) => {
        return Response;
      })
    );
  }
  /* Get mapped test cases */
  getMappedTestCases(): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient.get<any>(MAPPEDLIST, {
      params: params,
    }).pipe(
      map((Response: HttpResponse<any>) => {
        return Response;
      })
    );
  }

  /* get all test plan */
  getAllTestPlans(): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient.get<any>(GETALLTP, {
      params: params,
    }).pipe(
      map((Response: HttpResponse<any>) => {
        return Response;
      })
    );
  }
  /* Add to test plan */
  addToTestPlan(testId, editvalue, userRole): Observable<any> {
    const current_user = localStorage.getItem("userId");
    const username = JSON.parse(current_user).user.firstName;

    let params = new HttpParams();
    params = params.append("testplanname", editvalue);
    params = params.append("owner", username);
    params = params.append("tcmrole", userRole);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .post(ADDTOTESTPLAN, testId, {
        params: params,
        responseType: "text",
        observe: "response",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }
  getTeststepsofTestCase(testcaseId): Observable<any> {
    let params = new HttpParams();
    params = params.append("testcaseId", testcaseId);
    return this.httpClient
      .get<any>(TESTSTEPS_IN_MAPPEDTC, {
        params: params,
        observe: "response",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  getModifiedTestCases(): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(TESTCASES_UNDER_DEVELOPMENT, {
        params: params,
        observe: "response",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response["body"];
        })
      );
  }

  getAllPaths() {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(MODULE_PATH_LIST, {
        params: params,
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  /* get test cases for the selected filter */
  viewTestCases(
    selectedModule,
    selectedSubModule,
    selectedFolder,
    selectedPriority
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    let path;
    if (selectedSubModule !== undefined && selectedSubModule !== null) {
      path = selectedModule + '/' + selectedSubModule + '/' + selectedFolder;
    } else {
      path = selectedModule + '/' + selectedFolder;
    }
    params = params.append('modulePath', path)
    if (typeof selectedPriority === "string") {
      selectedPriority = [selectedPriority];
    }
    return this.httpClient
      .post(VIEWTESTCASES, selectedPriority, {
        params: params,
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response["body"];
        })
      );
  }

  gettotalTestcasespriority(modules, subModules, folder) {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    if (modules !== undefined) {
      params = params.append("module", modules);
    }
    if (subModules !== undefined) {
      params = params.append("submodule", subModules);
    }
    if (folder !== undefined) {
      params = params.append("folder", folder);
    }
    return this.httpClient
      .get(GETTCPRIORITYURL, {
        params: params,
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response["body"];
        })
      );
  }

  getTestCaseDetailsByTestCase(testCaseId, isMaster): Observable<any> {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "text/plain;charset=UTF-8");
    let params = new HttpParams();
    params = params.append("testCaseId", testCaseId);
    params = params.append("teamType", this.auth.accessTeamType);
    params = params.append("isMaster", isMaster);
    return this.httpClient
      .get(GETESTCASEDETAILS, {
        params: params,
        headers: headers,
        observe: "response",
        responseType: "text" as "json",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return JSON.parse(res["body"]);
        })
      );
  }
  createReport(
    formData,
    status,
    originalFileList,
    testcaseId,
    isMaster
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("clonedFromTcId", testcaseId);
    params = params.append("isMaster", isMaster);
    return this.httpClient
      .post("api/tcmaster/createTCfromUI", formData, {
        params: params,
        observe: "response",
        responseType: "text",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response["body"];
        })
      );
  }
  editReport(formData, status): Observable<any> {
    let params = new HttpParams();
    const userInfo = this.loginService.getAuthenticatedUser();
    params = params.append("username", userInfo.user.firstName);
    return this.httpClient
      .post(updateTCfromUI, formData, {
        observe: "response",
        responseType: "text",
        params: params,
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response["body"];
        })
      );
  }
  uploadReport(formData): Observable<any> {
    const userInfo = this.loginService.getAuthenticatedUser();
    let params = new HttpParams();
    params = params.append("emailId", userInfo.user.email);
    params = params.append("teamType", this.auth.accessTeamType);

    return this.httpClient
      .post(
        "/api/tcmaster/createTCfromUIUsingExcel?username=" +
        userInfo.user.firstName,
        formData,
        {
          observe: "response",
          responseType: "text",
          params: params,
        }
      )
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response["body"];
        })
      );
  }
  getAllUnMAppedModules(): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient.get<any>(ALLUNMAPEDGRPS, {
      params: params,
    }).pipe(
      map((res: HttpResponse<any>) => {
        return res;
      })
    );
  }
  DeleteGroup(moduleName, group) {
    let params = new HttpParams();
    params = params.append("group", group);
    params = params.append("groupName", moduleName);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .post(
        DELETEBUBBLE,
        {},
        {
          params: params,
          observe: "response",
          responseType: "text",
        }
      )
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  Editgroup(moduleName, group, moduleNameToEdit) {
    let params = new HttpParams();
    params = params.append("group", group);
    params = params.append("groupname", moduleNameToEdit);
    params = params.append("newgroupname", moduleName);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(EDITBUBBLE, {
        params: params,
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  Addgroup(moduleName, group) {
    let params = new HttpParams();
    params = params.append("group", group);
    params = params.append("groupname", moduleName);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(ADDBUBBLE, {
        params: params,
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }
  saveCreatedPath(module, subModule, folder) {
    let params = new HttpParams();
    params = params.append("module", module);
    params = params.append("submodule", subModule);
    params = params.append("teamType", this.auth.accessTeamType);
    params = params.append("folder", folder);
    return this.httpClient
      .post(
        SAVEMODULEPATH,
        {},
        {
          params: params,
          observe: "response",
          responseType: "text",
        }
      )
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  getModulePathsForMap() {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(GETDATAFORMAPPING, {
        observe: "response",
        responseType: "json",
        params: params,
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  getTestCasePath(testCaseID, isMaster) {
    let params = new HttpParams();
    params = params.append("testcaseId", testCaseID);
    params = params.append("isMaster", isMaster);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(GETMODULEPATH, {
        params: params,
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response["body"];
        })
      );
  }
  savepathToTestCase(testCaseID, modulePath, isMaster) {
    let params = new HttpParams();
    params = params.append("isMaster", isMaster);
    let requestBody;
    if (typeof modulePath === "string") {
      requestBody = {
        testcaseId: testCaseID.toString(),
        modulepath: modulePath.toString(),
      };
    } else {
      requestBody = {
        testcaseId: testCaseID.toString(),
        modulepath: Array.from(new Set(modulePath)).toString(),
      };
    }
    return this.httpClient
      .post(ADDPATH, requestBody, {
        params: params,
        observe: "response",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  getAcceptanceCriteria(jiraIds): Observable<any> {
    let params = new HttpParams();
    params = params.append("jiraIds", jiraIds);
    return this.httpClient
      .get(GETAC, {
        observe: "response",
        params: params,
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response["body"];
        })
      );
  }
  getALMAdditionalFieldsByTestCaseID(testCaseId, isMaster): Observable<any> {
    const headers = new HttpHeaders();
    headers.set("Content-Type", "text/plain;charset=UTF-8");
    let params = new HttpParams();
    params = params.append("testCaseId", testCaseId);
    params = params.append("isMaster", isMaster);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(getALMAdditionalFields, {
        params: params,
        headers: headers,
        observe: "response",
        responseType: "text" as "json",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return JSON.parse(res["body"]);
        })
      );
  }

getALMDropdownforTestCases(fieldName) {
    let params = new HttpParams();
    params = params.append("fieldName", fieldName);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(getALMDropdown, {
        params: params,
        observe: "response",
        responseType: "text" as "json",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return JSON.parse(res["body"]);
        })
      );
  }

  downloadReport(testId, fileName, isMaster) {
    const httpParams = new HttpParams()
      .set('testCaseID', testId)
      .set('isMaster', isMaster)
      .set('filename', fileName);
    return this.httpClient.get('/api/tcmaster/getFile', { responseType: 'blob' as 'blob', observe: 'response', params: httpParams });
  }

  resetNotificationCountForSubmittedTCs(): Observable<any> {
    let params = new HttpParams();
    const userInfo = this.loginService.getAuthenticatedUser();
    if (userInfo.user.vendorWithTCMRole) {
      params = params.append('userName', userInfo.user.userName);
      return this.httpClient
        .get('/api/vendors/clearAllSubmittedTCs', {
          observe: 'response',
          params: params,
        })
        .pipe(
          map((Response: HttpResponse<any>) => {
            return Response['body'];
          })
        );
    }
    else {
      params = params.append('userNtid', userInfo.user.userName);
      return this.httpClient
        .get('api/tcmaster/resetNotificationCountForSubmittedTCs', {
          observe: 'response',
          params: params,
        })
        .pipe(
          map((Response: HttpResponse<any>) => {
            return Response['body'];
          })
        );
    }

  }
}
