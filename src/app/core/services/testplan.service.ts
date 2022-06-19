import {
  HttpClient,
  HttpBackend,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../models/user";
import { LoginService } from "./login.service";
import { AuthInfo } from "../models/auth-info";

const TESTPLANLIST = "api/tcmaster/getCreatedTestplans";
const CLONETESTPLAN = "/api/tcmaster/cloneTestplan";
const DELETETESTPLAN = "api/tcmaster/deleteTestplan";
const GETUSER = "/api/users/listassignees"; /*get user and company details */
const ADDTOTESTPLANGROUP =
  "api/testplanGroup/addTestplanToTPGroup"; /* Add test plans to test plan group */
const GETTESTCASES =
  "/api/tcmaster/getTestcasesbyTestplanname"; /* get test cases of the test plan */
const GETTESTCASESWithoutTestSteps =
  "/api/tcmaster/getTestcasesbyTestplannameList"; /* get test cases of the test plan */
const DELETETESTCASES = "/api/tcmaster/addOrRemoveTestcasesFromTestplan";
const CREATETESTPLANGROUP =
  "api/tcrun/createTestplanGroup"; /* Create test plan group */
const GETTESTPLANGROUP =
  "api/testplanGroup/getallTestplanGroups"; /* Get test plan groups */
const EDITTESTPLANGROUP =
  "/api/testplanGroup/editTPGroup"; /* Edit Test plan group */
const DELETETESTPLANFROMTPGROUP =
  "api/testplanGroup/deleteTPfromTPGroup"; /* Delete Test plan from TP group */
const DELETETESTPLANGROUP = "api/testplanGroup/deleteTPGroup";
const SHAREDTESTPLAN =
  "/api/testsuitelist/getListOfSharedTestPlan?assigneeNtid=";
const sharedTestPlanSeen = "/api/users/resetNotificationCount?userId=";
const sharedTestPlanSeenVendor = "api/vendors/resetNotificationCount?userName=";
const getTotalNoOfTestPlanAssigned = '/api/users/getTotalNotificationCountOfTestPlan?userId=';
const getTotalNotificationCountOfTestPlanVendor = 'api/vendors/getTotalNotificationCountOfTestPlan?userName=';
const GETTPOFTPGRP = 'api/testplanGroup/getTestPlans';
const GETTESTRUN = '/api/testsuitelist/getListOfTestRun'; 
const addordeleteTestRun = '/api/testsuitelist/delTCfromTestRun'; 

export class Share {
  assigneeNtid: string;
  assignedByNtid: string;
  company: string;
  sharedDate: Date;
  testplanName: string;
  testPlans: any;
}
const ADDASSIGNEES =
  "api/assignees/add"; /*adding assignees like name,company and email */
@Injectable({
  providedIn: "root",
})
export class TestplanService {
  user: string;
  auth: string;

  constructor(
    private httpClient: HttpClient,
    handler: HttpBackend,
    private loginservice: LoginService
  ) {
    this.httpClient = new HttpClient(handler);
    this.auth = "Wi-Fi";
    this.user = "Wi-Fi";
  }

  addTestPlansToTestPlanGroup(
    testPlans,
    testplanGroupName,
    isAddTestruns,
    testRunId = null,
    userName = null
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("testplanGroupName", testplanGroupName);
    params = params.append("testplanNames", testPlans);
    params = params.append("isAddTestruns", isAddTestruns);
    params = params.append("testrunIds", testRunId);
    params = params.append("username", userName);
    return this.httpClient
      .post(
        ADDTOTESTPLANGROUP,
        {},
        {
          params: params,
          observe: "response",
          responseType: "text" as "json",
        }
      )
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  getTestPlans(): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType",  this.auth);
    return this.httpClient.get<any>(TESTPLANLIST, {
      params: params,
    }).pipe(
      map((Response: HttpResponse<any>) => {
        return Response;
      })
    );
  }

  cloneTestplan(testPlaneName, testPlaneNameToClone, username) {
    return this.httpClient
      .post(
        CLONETESTPLAN,
        {},
        {
          params: {
            testplanname: testPlaneNameToClone,
            owner: username,
            testplannameToclone: testPlaneName,
            teamType: this.auth
          },
        }
      )
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  /* Delete Test plan from the list */
  delTestPlan(TestPlanName): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType",  this.auth);
    return this.httpClient
      .post(DELETETESTPLAN, TestPlanName, {
        observe: "response",
        responseType: "text",
        params: params,
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  /* get user details for sharing */
  getUserCompany(): Observable<any> {
    let params = new HttpParams();
    return this.httpClient.get<any>(GETUSER, {
      params: params,
    }).pipe(
      map((Response: HttpResponse<any>) => {
        return Response;
      })
    );
  }

  /* share the test plan */
  shareTestPlans(
    assignee,
    assignedBy,
    company,
    email,
    testplanname
  ): Observable<any> {
    const body = new Share();
    const date = new Date();
    body.assignedByNtid = assignedBy;
    body.assigneeNtid = assignee;
    body.company = company;
    body.sharedDate = date;
    body.testPlans = testplanname;
    return this.httpClient
      .post(ADDASSIGNEES, body, {
        responseType: "text" as "json",
        observe: "response",
      })
      .pipe(
        map((Response) => {
          return Response;
        })
      );
  }
  /* get test cases of the test plan */
  getTestCases(TestPlanName): Observable<any> {
    let params = new HttpParams();
    params = params.append("testplanname", TestPlanName);
    params = params.append("teamType",  this.auth);
    return this.httpClient
      .get(GETTESTCASES, {
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
  /* get test cases of the test plan */
  getTestCasesWithOutSteps(TestPlanName): Observable<any> {
    let params = new HttpParams();
    params = params.append("testplanname", TestPlanName);
    params = params.append("teamType",  this.auth);
    return this.httpClient
      .get(GETTESTCASESWithoutTestSteps, {
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

    /* get test cases of the test plan */
    getTestCasesforTestRun(TestPlanName, TestCases): Observable<any> {
      console.log("TestPlanName, TestCases",TestPlanName, TestCases)
      let params = new HttpParams();
      params = params.append("teamType",  this.auth);
      params = params.append("testCaseIds", TestCases);
      params = params.append("testPlan", TestPlanName);
      return this.httpClient
        .get(GETTESTRUN, {
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

    addordelTestCasesinTestRun (TestCases, TestRunId, TestPlanName): Observable<any> {
      let params = new HttpParams();
      params = params.append("testCaseIds", TestCases);
      params = params.append("testRuns", TestRunId);
      params = params.append("testPlan", TestPlanName);
      return this.httpClient
        .get(addordeleteTestRun, {
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

  delTestCases(testPlaneName, TestCases): Observable<any> {
    let params = new HttpParams();
    params = params.append("testplanname", testPlaneName);
    params = params.append("teamType",  this.auth);
    return this.httpClient
      .post(DELETETESTCASES, TestCases, {
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

  getTestPlanGroup(dut = null): Observable<any> {
    let params = new HttpParams();
    params = params.append("dut", dut);
    params = params.append("teamType",  this.auth);
    return this.httpClient
      .get<any>(GETTESTPLANGROUP, {
        params: params,
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  getTestPlansOfTPGrp(testPlanGRP): Observable<any> {
    let params = new HttpParams();
    params = params.append("testPlanGroupName", testPlanGRP);
    params = params.append("teamType",  this.auth);
    return this.httpClient
      .get<any>(GETTPOFTPGRP, {
        params: params,
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  /* Create test plan Group */
  createTestPlanGroup(testPlanGroupRequestBody) {
    let params = new HttpParams();
    // params = params.append("teamType",  this.auth);
    return this.httpClient
      .post(CREATETESTPLANGROUP, testPlanGroupRequestBody, {
        observe: "response",
        params: params,
        responseType: "text",
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  editTestplanGroupName(
    newTestplanGroupName,
    testplanGroupName
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("existingTestplanGroupName", testplanGroupName);
    params = params.append("newTestplanGroupName", newTestplanGroupName);
    return this.httpClient
      .post(
        EDITTESTPLANGROUP,
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

  deleteTestplanFromGroupName(
    testplanToDelete,
    testplanGroupName
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("testplanGroupName", testplanGroupName);
    params = params.append("testplanName", testplanToDelete);
    return this.httpClient
      .post(
        DELETETESTPLANFROMTPGROUP,
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

  deleteTestplanGroup(testplanGroupName): Observable<any> {
    let params = new HttpParams();
    params = params.append("testplanGroupName", testplanGroupName);
    return this.httpClient
      .post(
        DELETETESTPLANGROUP,
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

  sharedTestPlan(UserId): Observable<any> {
  let params = new HttpParams();
  params = params.append("teamType",  this.auth);
    return this.httpClient
      .get(SHAREDTESTPLAN + UserId, {
        observe: "response",
        params:params,
      })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  sharedTestPlanSeen(UserId, vendors) {
    if (vendors !== null) {
      return this.httpClient
        .get(sharedTestPlanSeenVendor + UserId, {
          responseType: "text",
          observe: "response",
        })
        .pipe(
          map((Response: HttpResponse<any>) => {
            return Response;
          })
        );
    } else {
      return this.httpClient
        .get(sharedTestPlanSeen + UserId, {
          responseType: "text",
          observe: "response",
        })
        .pipe(
          map((Response: HttpResponse<any>) => {
            return Response;
          })
        );
    }
  }

  getSharedTestPlanCount(userID, vendor): Observable<any> {
    if (vendor !== null) {
      return this.httpClient.get<any>(getTotalNotificationCountOfTestPlanVendor + userID).pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        }),
      );
    } else {
      return this.httpClient.get<any>(getTotalNoOfTestPlanAssigned + userID).pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        }),
      );
    }

  }

  getSubmittedTcCount(): Observable<any> {
    let params = new HttpParams();
    const userInfo = this.loginservice.getAuthenticatedUser();
    params = params.append('userName', userInfo.user.userName);
    if (userInfo.user.vendorWithTCMRole) {
      return this.httpClient
        .get('/api/vendors/getNotificationCountForSubmittedTCsForVendors', {
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
        .get('api/tcmaster/getNotificationCountForSubmittedTCs', {
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
