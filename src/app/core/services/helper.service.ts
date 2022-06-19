import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HelperService {
  testCases: any;
  previousURL: any;
  testplanGroupName: any;
  DutNTestplanGroup: any[];
  showNotificationBar = false;

  constructor() {}
  /* set path to storage */
  setSelectedPath(path) {
    const Selectedpath = JSON.stringify(path);
    localStorage.setItem("SelectedPath", Selectedpath);
  }

  /* get path from storage */
  getSelectedPath() {
    const Selectedpath = localStorage.getItem("SelectedPath");
    return JSON.parse(Selectedpath);
  }

  storeTestCaseList(testCases) {
    testCases.forEach((element) => {
      element["Select"] = false;
    });
    this.testCases = testCases;
  }

  getTestCases() {
    return this.testCases;
  }

  saveCurrentpath(status) {
    localStorage.setItem("fromTc", status);
  }

  SaveSharedTestPlan(testCases) {
    localStorage.setItem("SaveSharedTestPlan", testCases);
  }

  getSaveSharedTestPlan() {
    const tescase = localStorage.getItem("SaveSharedTestPlan");

    const response = tescase.replace(new RegExp("testcaseName", "g"), "tcname");
    return JSON.parse(response);
  }

  getPath() {
    const fromTc = localStorage.getItem("fromTc");
    return fromTc;
  }

  /* set path to storage */
  setSelectedTestCases(name) {
    const TestPlanName = JSON.stringify(name);
    localStorage.setItem("TestPlanName", TestPlanName);
  }

  /* get path from storage */
  getSelectedTestCases() {
    const TestPlanName = localStorage.getItem("TestPlanName");
    return JSON.parse(TestPlanName);
  }

  setAddREdit(option) {
    localStorage.setItem("setAddREdit", option);
  }

  getAddREdit() {
    const option = localStorage.getItem("setAddREdit");
    return option;
  }

  setPreviousURL(URL: string) {
    this.previousURL = URL;
  }

  getPreviousURL(): string {
    if (this.previousURL) {
      return this.previousURL;
    } else {
      return "";
    }
  }

  set selectedTestPlanGroupName(testplanGroupName) {
    this.testplanGroupName = testplanGroupName;
  }
  get selectedTestPlanGroupName() {
    return this.testplanGroupName;
  }

  set setDutNTestplanGroup(DutNTestplanGroup: Array<any>) {
    this.DutNTestplanGroup = DutNTestplanGroup;
  }

  get setDutNTestplanGroup() {
    return this.DutNTestplanGroup;
  }

  showNotification() {
    this.showNotificationBar = true;
  }

  getshowNotification() {
    return this.showNotificationBar;
  }

  /* Set the test case , filter , sort, pageindex,page size to focus next test case */
  set retainPaginationNscrollPosition(paginationNposition) {
    const position = JSON.stringify(paginationNposition);
    localStorage.setItem("paginationNscrollposition_TestRun", position);
  }

  /* get the focus point */
  get retainPaginationNscrollPosition() {
    const option = localStorage.getItem("paginationNscrollposition_TestRun");
    return JSON.parse(option);
  }

  setLocalStorage(Name, Details) {
    localStorage.setItem(Name, Details);
  }

  getLocalStorage(Name) {
    const option = localStorage.getItem(Name);
    return JSON.parse(option);
  }

  removeLocalStorage(Name) {
    localStorage.removeItem(Name);
  }

  setbreadCrumb(path) {
    const breadCrumb = JSON.stringify(path);
    localStorage.setItem("breadCrumb", breadCrumb);
  }

  getbreadCrumb() {
    const option = localStorage.getItem("breadCrumb");
    return option;
  }
}
