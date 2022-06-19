import { Component, OnInit, ViewChild } from '@angular/core';
import { GridOptions } from "ag-grid-community";
import { TableComponent } from "src/app/shared/table/table.component";

import { TestplanService } from "src/app/core/services/testplan.service";

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {
  testPlanName = "";
  testCasesForDownloads: any;
  testCasesList: any;
  @ViewChild("testCaseTable") testCaseTable: TableComponent;
  listCoulmns = [];
  testRunCoulmns= [];
  testCases = null;
  gridOptions: GridOptions = {
    suppressCellSelection: false,
    suppressRowClickSelection: true,
    context: {
      componentParent: this,
    },
    defaultColDef: {
      resizable: true,
      suppressMovable: true,
      editable: false,
      flex: 1,
    },
    rowStyle: {
      "border-bottom": "white 10px solid",
      "border-top": "white 10px solid",
    },
    rowData: null,
  };


  //tcrun
  displaytestRun: any;

  overlayLoadingTemplate = "";
  overlayNoRowsTemplate = "";
  timeout: any = null;
  testRunGridApi: any;
  testRunGridColumnApi: any;
  testRunGridOptions: GridOptions = {
    suppressCellSelection: false,
    suppressRowClickSelection: true,
    context: {
      componentParent: this,
    },
  }
  constructor(
    private testplanlistService: TestplanService,

  ) { }
  

  ngOnInit(): void {
    console.log("testCaseTable",this.testCaseTable)
    this.listCoulmns = [
      {
        lockPosition: true,
        width: 70,
        minWidth: 50,
        autoHeight: true,
        sortable: true,
        headerName: "ID",
        sort: null,
        field: "testcaseId",
        pinned: "left",
        hide: false,
        // comparator: this._sortAlphanumeric,
        // cellRendererFramework: TestplanHelperComponent,
        cellRendererParams: {
          dataFromParent: "testcaseId",
        },
        getQuickFilterText: (params) => {
          if (params.column.visible) {
            return params.value;
          }
        },
      },
      {
        width: 70,
        minWidth: 50,
        sortable: true,
        headerName: "XM Test Case ID",
        field: "xmTestCaseId",
        // cellRendererFramework: HelperComponent,
        cellRendererParams: {
          dataFromParent: "xmTestCaseId",
        },
        getQuickFilterText: (params) => {
          if (params.column.visible) {
            return params.value;
          }
        },
      },
      {
        width: 350,
        minWidth: 70,
        sortable: true,
        sort: null,
        headerName: "Name",
        field: "tcname",
        // cellRendererFramework: HelperComponent,
        cellRendererParams: {
          dataFromParent: "tcname",
        },
        hide: false,
        getQuickFilterText: (params) => {
          if (params.column.visible) {
            return params.value;
          }
        },
      },
      {
        width: 80,
        minWidth: 50,
        sortable: true,
        headerName: "Priority",
        sort: "asc",
        field: "priority",
        // cellRendererFramework: HelperComponent,
        cellRendererParams: {
          dataFromParent: "priority",
        },
        hide: false,
        getQuickFilterText: (params) => {
          if (params.column.visible) {
            return params.value;
          }
        },
      },
      {
        width: 100,
        minWidth: 70,
        sortable: true,
        sort: null,
        headerName: "Module Path",
        field: "modulepaths",
        // cellRendererFramework: HelperComponent,
        cellRendererParams: {
          dataFromParent: "modulepath",
        },
        hide: false,
        getQuickFilterText: (params) => {
          if (params.column.visible) {
            return params.value;
          }
        },
      },
      {
        width: 100,
        minWidth: 70,
        sortable: true,
        sort: null,
        headerName: "Remarks",
        field: "remarks",
        // cellRendererFramework: HelperComponent,
        cellRendererParams: {
          dataFromParent: "remarks",
        },
        getQuickFilterText: (params) => {
          if (params.column.visible) {
            return params.value;
          }
        },
      },
      {
        width: 70,
        minWidth: 70,
        sortable: false,
        sort: null,
        headerName: "Traceabilty",
        field: "traceablity",
        // cellRendererFramework: HelperComponent,
        cellRendererParams: {
          dataFromParent: "traceablity",
        },
        hide: false,
        getQuickFilterText: (params) => {
          if (params.column.visible) {
            return params.value;
          }
        },
      },
    ];
    this.testRunCoulmns = [
      {
        sortable: true,
        headerName: "Test Run ID",
        sort: null,
        field: "testcaseId",
        hide: false,
        comparator: this._sortAlphanumeric,
        // cellRendererFramework: TestplanHelperComponent,
        cellRendererParams: {
          dataFromParent: "testcaseId",
        },
      },
    ];
    this.getTestPlamDetails()

  }

  ngAfterViewInit() { }
  onGridReady(params) {
    params.api.sizeColumnsToFit();
    this.testRunGridApi = params.api;
    this.testRunGridColumnApi = params.columnApi;

    this.testRunGridApi.setDomLayout("autoHeight");
  }

  onColumnResized() {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      this.testRunGridApi.resetRowHeights();
    }, 1000);
  }

  _sortAlphanumeric(a: string, b: string): number {
    a = a ? a : "";
    b = b ? b : "";
    return a.toString().localeCompare(b.toString(), "en", { numeric: true });
  }

  getTestPlamDetails() {
    // this.testCaseTable.overlayLoadingTemplate = `<span class="ag-overlay-loading-center"><i style="font-size: 3em;color: #0067ab;" class="fas fa-circle-notch fa-spin"></i><br>
    // <span style="
    // font-size: 100%;
    // font-family: "IBMPlexSans-Regular";" class="loadingText">Fetching Test Cases</span></span>`;
    // if (this.testCaseTable.gridApi)
    //   this.testCaseTable.gridApi.showLoadingOverlay();
    this.testplanlistService
      .getTestCases("Final_AD_testing")
      .subscribe((Response) => {
        console.log("res",Response)

        this.testCasesForDownloads = JSON.parse(Response["body"]);
      });
    this.testplanlistService
      .getTestCasesWithOutSteps("Final_AD_testing")
      .subscribe((Response) => {
        console.log("res2",Response)
        if (Response.length !== 0) {
          this.testCasesList = JSON.parse(Response["body"]);
          const testCases = JSON.parse(Response["body"]);
          this.displaytestRun = testCases;
          this.testCaseTable.dataForPaginator = testCases;
          if (this.testCaseTable.gridApi)
            this.testCaseTable.gridApi.hideOverlay();
        }
      });
  }

}
