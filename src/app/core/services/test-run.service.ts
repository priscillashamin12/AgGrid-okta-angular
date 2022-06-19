import {
  HttpClient,
  HttpBackend,
  HttpResponse,
  HttpParams,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { AuthInfo } from "../models/auth-info";
import { User } from "../models/user";
import { LoginService } from "./login.service";

const GET_ALL_RUN = "/api/tcrun/getall";
const editTestrunId = "/api/tcrun/editTestrunId";
const TestPlanList = "api/assignees/getDetailsForRole";

const TESTRUNDETAILSFROMID = "/api/tcrun/getTestrundetailsById";
const TESTRUNDETAILSFROMIDVENDOR =
  "/api/tcrunVendor/getTestrundetailsByIdForVendors";
const GETALLURL = "/api/tcrun/listForDropdown";
const GETALLURLFORVENDOR = "api/tcrunVendor/listForDropdownForVendors";
const ExecuteTest = "api/tcrun/run";
const ExecuteVendorTest = "api/tcrun/runVendor";
const ReleaseDetails = "/api/execdetails/getdetsfordevice";
const VersionDetails = "/api/tcrun/listChipSets";
const GETDEVICEMODEL = "/api/tcrun/listForDropdownGetDevModel";
const GETTESTSETUPLOCATION = "/api/tcrun/listForDropdownGetTestsetup";
const GETWIFICHIPSETDATA = "/api/tcrun/listForDropdownGetWifiChipset";
const getProgressBarStatus = "/api/tcrun/getDataforProgressbar?testrunId=";
const GETTESTSTEPOFTESTCASE = "api/tcrun/getTeststepsOfTestrun";
const saveAll = "/api/tcrun/saveAllTeststep";
const bulkUpdateTestCases = "api/tcrun/bulkupdateTestcaseInTestrun";
const validateDefect = "api/jira/validateDefect";
const getTestPlanGroup = "api/testplanGroup/getallTestplanGroups";
const GETALLTestcaseDetails = "/api/tcrun/getallTestcaseResults";
const GETFAILEDURL = "/api/tcrun/getPassFailTestcaseDetails";
const GETDETAILEDTABLE = "/api/tcrun/getDetailedSummaryTableData";
const GETFAILEDTESTCASES = "/api/tcrun/getListOfTestcaseDetailsInBuildVersion";
const GETALLIDSURL = "api/tcmaster/getAllTestcaseIds";
const GETESTCASEDETAILS = "api/tcmaster/getByTestcaseId";
const GETAPPROVETESTCASEURL = "api/tcmaster/approveTestcase";
const GETALLFORVENDOR = "api/tcrunVendor/getallTestcaseResultsForVendors";
const GETDETAILEDTABLEFORVENDOR =
  "api/tcrunVendor/getDetailedSummaryTableDataForVendor";
const GETESTCASEDETAILSFROMMASTERNTEMP =
  "api/tcmaster/getByTCIdFromTempAndMasterTables";
const GETFILESFROMTESTRUN = "api/tcrun/getFile";
const GETGRAPHDATA = "/api/tcrun/getGraphData";
const COMPARISONREPORT = "/api/tcrun/compareTestreports";
const COMPARISONREPORTSHARE = "/api/tcrun/shareComparedReports";
const COMPARISONEXECUTIVEREPORTSHARE = "/api/tcrun/shareComparedExecReports";
const GETCOMPARISONREPORTSHAREID = "api/tcrun/getComparisonReport";
const GETCOMPARISONExecREPORTSHAREID = "api/tcrun/getComparisonExecReport";
const PARTIALLYCOMPLETEDRUN = "api/tcrun/runPartiallyCompletedTest";
const ADDCOMMENT = "api/tcruncomment/addComments";
const EDITCOMMENT = "api/tcruncomment/editComment";
const VIEWCOMMENT = "api/tcruncomment/viewComments";
const DELETECOMMENT = "api/tcruncomment/deleteComment";
const TESTRUNFORVENDOR = "/api/tcrunVendor/getallForVendors";
const attachFilesToTCinTestrun = "api/tcrun/attachFilesToTCinTestrun";
const VALIDATEMAIL = "/api/tcrun/validateUserBeforeSharingReport";
const VALIDATEUSERAFTERSHARE = "/api/tcrun/validateUserAfterSharingReport";
const validateUserComparisonReport = "api/tcrun/validateUserCompareReports";
const compareExecutiveReportData = "api/tcrun/compareExecutiveReportData"
@Injectable({
  providedIn: "root",
})
export class TestRunService {
  public execDetails = [];
  user: User = new User();
  auth: AuthInfo = new AuthInfo();
  userName: string;
  constructor(
    private httpClient: HttpClient,
    handler: HttpBackend,
    private loginService: LoginService
  ) {
    this.httpClient = new HttpClient(handler);
    this.auth = this.loginService.getAuthenticatedUser();
    this.user = this.auth.user;
  }
  executiveReportComparison(testplanGroupList) {
    let requestBody = { testplanGroups: testplanGroupList, teamType: this.auth.accessTeamType };
    return this.httpClient.post(compareExecutiveReportData, requestBody, {
      observe: "response",
      responseType: "json",
    })
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response['body']

        }));
  }

  getAll(vendor, ifVendor): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    if (ifVendor) {
      params = params.append("vendor", vendor);
      params = params.append("isComcastUser", "false");
      return this.httpClient
        .get(TESTRUNFORVENDOR, {
          observe: "response",
          params: params,
        })
        .pipe(
          map((res: HttpResponse<any>) => {
            res["body"].forEach((element) => {
              /* addind variable to provide check box in the summary table */
              element["selected"] = false;
            });
            return res;
          })
        );
    } else {
      return this.httpClient
        .get(GET_ALL_RUN, {
          observe: "response",
          params: params,
        })
        .pipe(
          map((res: HttpResponse<any>) => {
            res["body"].forEach((element) => {
              /* adding variable to provide check box in the summary table */
              element["selected"] = false;
            });
            return res;
          })
        );
    }
  }
  EditTestRunId(testRunId, newTesRunID, ifVendor) {
    let params = new HttpParams();
    params = params.append("oldTestrunId", testRunId);
    params = params.append("newTestrunId", newTesRunID);
    params = params.append("isVendor", ifVendor);
    return this.httpClient
      .post(
        editTestrunId,
        {},
        {
          params: params,
          responseType: "text",
          observe: "response",
        }
      )
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  // API for getting test plan
  getTestDetails(vendor): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    params = params.append("vendor", vendor);
    return this.httpClient
      .get(TestPlanList, {
        observe: "response",
        params: params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  getReleaseDetails(deviceName, vendor): Observable<any> {
    return this.httpClient
      .post(
        ReleaseDetails,
        { device: deviceName },
        {
          observe: "response",
          params: {
            vendor: vendor,
            teamType: this.auth.accessTeamType
          },
        }
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
  getVersionDetails(version): Observable<any> {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .post(
        VersionDetails,
        { chipset: version },
        {
          observe: "response",
          params: params,
        }
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
  //  API for execution trigger
  startExecution(details, ifVendor): Observable<any> {
    let params = new HttpParams();
    if (ifVendor) {
      return this.httpClient
        .post(ExecuteVendorTest, details, {
          observe: "response",
        })
        .pipe(
          map((res: HttpResponse<any>) => {
            return res;
          })
        );
    } else {
      return this.httpClient
        .post(ExecuteTest, details, {
          params: params,
          observe: "response",
        })
        .pipe(
          map((res: HttpResponse<any>) => {
            return res;
          })
        );
    }
  }

  // API for getting Release version, WiFi Chipset, Driver, device
  getAllDetails(vendor, ifVendor): Observable<any> {
    let params = new HttpParams();
    this.auth = this.loginService.getAuthenticatedUser();
    if (ifVendor) {
      const isChipset =
        this.auth.user.vendorType === "Chipset" ? "true" : "false";
      return this.httpClient
        .get<any>(GETALLURLFORVENDOR, {
          params: {
            vendor: vendor,
            isWifichipsetVendor: isChipset,
            teamType: this.auth.accessTeamType
          },
        })
        .pipe(
          map((res: HttpResponse<any>) => {
            this.execDetails = res as any;
            return res;
          })
        );
    } else {
      params = params.append("teamType", this.auth.accessTeamType);
      return this.httpClient.get<any>(GETALLURL, {
        params: params,
      }).pipe(
        map((res: HttpResponse<any>) => {
          this.execDetails = res as any;
          return res;
        })
      );
    }
  }

  /* Get All Device Models */
  getDeviceModel() {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(GETDEVICEMODEL, {
        observe: "response",
        params: params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  /* Get All Test Setup */
  getTestSetUpLocations() {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(GETTESTSETUPLOCATION, {
        observe: "response",
        params: params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  /* Get all Wifi Chipset */
  getWiFiChipset() {
    let params = new HttpParams();
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(GETWIFICHIPSETDATA, {
        observe: "response",
        params: params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  testrundetailsFromId(TestrunId, ifVendor): Observable<any> {
    let params = new HttpParams();
    params = params.append("testrunId", TestrunId);
    if (ifVendor) {
      return this.httpClient
        .get(TESTRUNDETAILSFROMIDVENDOR, {
          params: params,
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
        .get(TESTRUNDETAILSFROMID, {
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
  }

  getProgressBarStatus(TestrunId, ifVendor) {
    let params = new HttpParams();
    params = params.append("isVendor", ifVendor);
    return this.httpClient
      .get(getProgressBarStatus + TestrunId, {
        observe: "response",
        params: params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  /* Get Test step of a test case Id from test run */
  getTestStepOfTestCaseID(TestrunId, TestCaseID, ifVendor) {
    let params = new HttpParams();
    params = params.append("testrunId", TestrunId);
    params = params.append("testCaseID", TestCaseID);
    params = params.append("isVendor", ifVendor);
    return this.httpClient
      .get(GETTESTSTEPOFTESTCASE, {
        observe: "response",
        params: params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  saveTestSteps(TestrunId, TestCaseId, buildVersion, testSteps, ifVendor) {
    this.auth = this.loginService.getAuthenticatedUser();
    this.user = this.auth.user;
    this.userName = this.user.firstName;
    const headers = new HttpHeaders({
      "Content-Type": "application/JSON",
    });
    let params = new HttpParams();
    params = params.append("testrunId", TestrunId);
    params = params.append("testcaseId", TestCaseId);
    params = params.append("buildVersion", buildVersion);
    params = params.append("testerName", this.userName);
    params = params.append("isVendor", ifVendor);
    return this.httpClient
      .post(saveAll, testSteps, {
        params: params,
        observe: "response",
        headers,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  bulkUpdateTestRun(
    testrunId,
    testcaseId,
    buildVersion,
    isVendor,
    status,
    defectID,
    actualResult
  ) {
    this.auth = this.loginService.getAuthenticatedUser();
    this.user = this.auth.user;
    this.userName = this.user.firstName;

    let requestBody = {
      testrunId: testrunId,
      testCaseID: testcaseId,
      status: status,
      isVendor: isVendor,
      buildVersion: buildVersion,
      testerName: this.userName,
      testStep: [defectID, actualResult],
    };

    return this.httpClient
      .post(bulkUpdateTestCases, requestBody, {
        observe: "response",
        responseType: "text",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
  validateDefect(defectID): Observable<any> {
    return this.httpClient
      .get(validateDefect, {
        observe: "response",
        params: {
          defectIds: defectID,
        },
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  getTestPlanGroups(dut = null): Observable<any> {
    let params = new HttpParams();
    params = params.append("dut", dut);
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(getTestPlanGroup, {
        params: params,
        observe: "response",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  getTestCaseDetails(testRunId, isVendor): Observable<any> {
    if (isVendor) {
      let params = new HttpParams();
      params = params.append("testrunId", testRunId);
      return this.httpClient
        .get(GETALLFORVENDOR, {
          params: params,
          observe: "response",
        })
        .pipe(
          map((res: HttpResponse<any>) => {
            return res;
          })
        );
    } else {
      let params = new HttpParams();
      params = params.append("testrunId", testRunId);
      params = params.append("teamType", this.auth.accessTeamType);
      return this.httpClient
        .get(GETALLTestcaseDetails, {
          params: params,
          observe: "response",
        })
        .pipe(
          map((res: HttpResponse<any>) => {
            return res;
          })
        );
    }
  }
  getFailedTestCaseDetails(
    testRunId,
    isVendor,
    testcaseStatus = "fail"
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append("testrunId", testRunId);
    params = params.append("isVendor", isVendor);
    params = params.append("testcaseStatus", testcaseStatus);

    return this.httpClient
      .get(GETFAILEDURL, {
        params: params,
        observe: "response",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  getDetailedSummaryTableData(testRunId, isVendor): Observable<any> {
    if (isVendor) {
      let params = new HttpParams();
      params = params.append("testrunId", testRunId);
      return this.httpClient
        .get(GETDETAILEDTABLEFORVENDOR, {
          params: params,
          observe: "response",
        })
        .pipe(
          map((res: HttpResponse<any>) => {
            return res;
          })
        );
    } else {
      let params = new HttpParams();
      params = params.append("testrunId", testRunId);
      return this.httpClient
        .get(GETDETAILEDTABLE, {
          params: params,
          observe: "response",
        })
        .pipe(
          map((res: HttpResponse<any>) => {
            return res;
          })
        );
    }
  }

  getFailedTestCases(testRunId, requestBody, isVendor): Observable<any> {
    let params = new HttpParams();
    params = params.append("testrunId", testRunId);
    params = params.append("isVendor", isVendor);
    return this.httpClient

      .post(GETFAILEDTESTCASES, requestBody, {
        params: params,
        observe: "response",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  getGraphData(testrunId, status, isVendor): Observable<any> {
    let params = new HttpParams();
    params = params.append("testrunId", testrunId);
    params = params.append("status", status);
    params = params.append("isVendor", isVendor);
    return this.httpClient
      .get(GETGRAPHDATA, {
        params: params,
        observe: "response",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  runPartiallyCompletedTest(testrunId, isVendor): Observable<any> {
    let params = new HttpParams();
    params = params.append("testrunId", testrunId);
    params = params.append("isVendor", isVendor);
    return this.httpClient
      .get(PARTIALLYCOMPLETEDRUN, {
        responseType: "text" as "json",
        observe: "response",
        params: params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
  deleteTestRun(TestrunId, ifVendor) {
    let params = new HttpParams();
    params = params.append("testrunId", TestrunId);
    params = params.append("isVendor", ifVendor);
    return this.httpClient
      .post(
        "/api/tcrun/deleteTestrun",
        {},
        {
          params: params,
          observe: "response",
        }
      )
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }
  updateCompletedDone(TestrunId, durration, ifVendor): Observable<any> {
    let params = new HttpParams();
    params = params.append("testrunId", TestrunId);
    params = params.append("duration", durration);
    params = params.append("isVendor", ifVendor);
    return this.httpClient
      .post(
        "/api/tcrun/done",
        {},
        {
          params: params,
          observe: "response",
        }
      )
      .pipe(
        map((Response: HttpResponse<any>) => {
          return Response;
        })
      );
  }

  getComparisonReport(testrunId): Observable<any> {
    return this.httpClient
      .post(COMPARISONREPORT, testrunId, {
        observe: "response",
        responseType: "json",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  storeComparisonFields(testrunId, customField): Observable<any> {
    let requestBody = {
      customizedFields: customField,
      testrunIds: testrunId
    };
    return this.httpClient
      .post(COMPARISONREPORTSHARE, requestBody, {
        observe: "response",
        responseType: "text",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  storeExectiveComparisonFields(testPlanGroupName, customField): Observable<any> {
    let requestBody = {
      customizedFields: customField,
      testplanGroups: testPlanGroupName
    };
    return this.httpClient
      .post(COMPARISONEXECUTIVEREPORTSHARE, requestBody, {
        observe: "response",
        responseType: "text",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  getExectiveComparisonFields(ID): Observable<any> {
    let params = new HttpParams();
    params = params.append("shareId", ID);
    return this.httpClient
      .get(GETCOMPARISONExecREPORTSHAREID, {
        observe: "response",
        responseType: "json",
        params: params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  getTestRunsNField(ID): Observable<any> {
    let params = new HttpParams();
    params = params.append("shareId", ID);
    return this.httpClient
      .get(GETCOMPARISONREPORTSHAREID, {
        observe: "response",
        responseType: "json",
        params: params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  addComments(commentObject): Observable<any> {
    return this.httpClient
      .post(ADDCOMMENT, commentObject, {
        responseType: "text" as "json",
        observe: "response",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  viewComments(commentObject): Observable<any> {
    return this.httpClient
      .post(VIEWCOMMENT, commentObject, {
        responseType: "json",
        observe: "response",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  EditComments(commentObject): Observable<any> {
    return this.httpClient
      .post(EDITCOMMENT, commentObject, {
        responseType: "text" as "json",
        observe: "response",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  DeleteComments(commentObject): Observable<any> {
    return this.httpClient
      .post(DELETECOMMENT, commentObject, {
        responseType: "text" as "json",
        observe: "response",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  getVendorTestRuns(): Observable<any> {
    let params = new HttpParams();
    params = params.append("vendor", null);
    params = params.append("isComcastUser", "true");
    params = params.append("teamType", this.auth.accessTeamType);
    return this.httpClient
      .get(TESTRUNFORVENDOR, {
        observe: "response",
        params: params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  attachFilesToTCinTestrun(
    testrunId,
    testcaseId,
    filesBody,
    isVendor,
    stepName
  ) {
    let params = new HttpParams();
    params = params.append("testrunId", testrunId);
    params = params.append("testcaseId", testcaseId);
    params = params.append("isVendor", isVendor);
    params = params.append("stepName", stepName);

    return this.httpClient
      .post(attachFilesToTCinTestrun, filesBody, {
        observe: "response",
        responseType: "text",
        params: params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  downloadFilesFromTestrun(
    testrunId,
    testCaseID,
    filename,
    isVendor,
    stepName
  ) {
    const httpParams = new HttpParams()
      .set("testrunId", testrunId)
      .set("testCaseID", testCaseID)
      .set("filename", filename)
      .set("stepName", stepName)
      .set("isVendor", isVendor);
    return this.httpClient.get(GETFILESFROMTESTRUN, {
      responseType: "blob" as "blob",
      observe: "response",
      params: httpParams,
    });
  }
  validateVendorBeforeshare(testRunId, shareToMailID, isVendor) {
    let params = new HttpParams();
    params = params.append("testRunId", testRunId);
    params = params.append("shareToMailID", shareToMailID);
    params = params.append("isVendorReport", isVendor);

    return this.httpClient
      .get(VALIDATEMAIL, {
        observe: "response",
        params: params,
        responseType: "text",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
  validateVendorAftershare(testRunId, shareToMailID) {
    return this.httpClient
      .get(VALIDATEUSERAFTERSHARE, {
        observe: "response",
        params: {
          testRunId: testRunId,
          shareToMailID: shareToMailID,
        },
        responseType: "text",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }

  validateUserMailComparisonReport(userMail) {
    return this.httpClient
      .get(validateUserComparisonReport, {
        observe: "response",
        params: {
          mailId: userMail,
        },
        responseType: "text",
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          return res;
        })
      );
  }
}
