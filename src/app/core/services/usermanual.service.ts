import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
const COMPAREREPORT =
  "../../../assets/UserManual/TestRunPage/Compare_Report.html";
const DETAILEDTESTRUN =
  "../../../assets/UserManual/TestRunPage/Detailed_Test_Run.html";
const TESTRUNREPORT =
  "../../../assets/UserManual/TestRunPage/TestRun_Usermanual.html";
const EXECUTIVEREPORT =
  "../../../assets/UserManual/TestReportPage/TestReport_Usermanual.html";
const VENDORREPORT =
  "../../../assets/UserManual/TestReportPage/VendorReport_Usermanual.html";
const TESTPLANREPORT =
  "../../../assets/UserManual/TestReportPage/TestPlan_Report.html";
const TESTCASES =
  "../../../assets/UserManual/TestCaseLayoutPage/TestCaseLayout_Usermanual.html";
const TESTCASESPATHCONFIGURE =
  "../../../assets/UserManual/TestCaseLayoutPage/TestCaseLayout_ConfigurePath.html";
const TESTCASESPATHEDIT =
  "../../../assets/UserManual/TestCaseLayoutPage/TestCaseLayout_AddREditPath.html";
const TESTCASECREATE =
  "../../../assets/UserManual/TestCaseLayoutPage/TestCaseLayout_CreateTC.html";
const TESTCASEEDIT =
  "../../../assets/UserManual/TestCaseLayoutPage/TestCaseLayout_EditTC.html";
const USERCONFIG =
"../../../assets/UserManual/UserConfiguration/UserConfig.html";
const SPECIFICATIONS =
"../../../assets/UserManual/Specifications/Specification.html";
const TESTPLAN =
"../../../assets/UserManual/TestPlanManagement/testPlan.html"
const TESTPLANGROUP =
"../../../assets/UserManual/TestPlanManagement/testPlanGroup.html"
const SHAREDPLANS =
"../../../assets/UserManual/TestPlanManagement/SharedTestPlan.html"
const HOME =
'../../../assets/UserManual/Home/HomePage.html'

@Injectable({
  providedIn: "root",
})
export class UsermanualService {
  constructor(private http: HttpClient, private router: Router) {}

  loadTestRunHTML() {
    return this.http.get(TESTRUNREPORT, {
      responseType: "text",
    });
  }
  loadCompareReportHTML() {
    return this.http.get(COMPAREREPORT, {
      responseType: "text",
    });
  }
  loadExecutiveReport() {
    return this.http.get(EXECUTIVEREPORT, {
      responseType: "text",
    });
  }
  loadDetailedReport() {
    return this.http.get(DETAILEDTESTRUN, {
      responseType: "text",
    });
  }
  loadVendorReport() {
    return this.http.get(VENDORREPORT, {
      responseType: "text",
    });
  }
  loadTPReport() {
    return this.http.get(TESTPLANREPORT, {
      responseType: "text",
    });
  }
  loadTestcases() {
    if (this.router.url.includes("/createTestCase")) {
      return this.http.get(TESTCASECREATE, {
        responseType: "text",
      });
    } else if (this.router.url.includes("/editTestCase")) {
      return this.http.get(TESTCASEEDIT, {
        responseType: "text",
      });
    } else if (this.router.url.includes("/create")) {
      return this.http.get(TESTCASESPATHCONFIGURE, {
        responseType: "text",
      });
    } else if (this.router.url.includes("/edit")) {
      return this.http.get(TESTCASESPATHEDIT, {
        responseType: "text",
      });
    } else {
      return this.http.get(TESTCASES, {
        responseType: "text",
      });
    }
  }

  loadUserConfig() {
    return this.http.get(USERCONFIG, {
      responseType: "text",
    });
  }

  loadSpecifications(){
    return this.http.get(SPECIFICATIONS, {
      responseType : "text",
    });
  }

  loadTestPlans(){
   if (this.router.url.includes("/Testplans")){
    return this.http.get(TESTPLAN, {
      responseType : "text",
    });
  }
  }

  loadTestPlanGroup() {
    return this.http.get(TESTPLANGROUP, {
      responseType : "text",
    });
  }

  SharedTestPlan() {
    return this.http.get(SHAREDPLANS, {
      responseType : "text",
    });
  }

  loadDashboard() {
    return this.http.get(HOME, {
      responseType : "text",
    })
  }
}
