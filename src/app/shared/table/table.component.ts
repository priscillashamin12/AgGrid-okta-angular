import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { GridApi, GridOptions } from "ag-grid-community";
// import { HelperComponent } from "../helper/helper.component";
import { DatePipe } from "@angular/common";
import { INoRowsOverlayAngularComp } from "ag-grid-angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
  providers: [DatePipe],
})
export class TableComponent {
  @Input() columnDefs :any;
  @Input() Data:any;
  style = {
    width: "100%",
    height: "100%",
    flex: "1 1 auto",
  };
  hideNshowPaginator = true;
  numberOfCompletedTestcases: any;
  totalNumberofTestcases: any;
  // percentageCompletion: string;
  // progressData: string;
  displayedColumns: string[] = [];
  dataForPaginator = [];
  completedTestRun = 0;
  InProgressTestRun = 0;
  paginationPageSize = 50;
  NoOfitemsPerPage = 50;
  currentPageIndex = 0;
  overlayLoadingTemplate = "Fetching Data";
  overlayNoRowsTemplate = `<div >
  <img style="width:20%" src="../../../assets/Icons/No item found Illustration.png" alt="">
  <div style="  
  font-family: IBMPlexSans-Medium;
  font-size: 87.50%;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.95;
  letter-spacing: normal;
  color: #008ad2;">
    No items were found matching your search request.
  </div>
  <div>
  <ul style="padding-inline-start: 13px;">
  <li style="text-align: left;">
    Check the spelling of your keyword
  </li>
  <li style="text-align: left;">
    Check respective column is visible
  </li>
  <li style="text-align: left;">Try alternate words</li>
  <li style="text-align: left;">Try entering fewer keywords</li>
</ul>
</div>
</div>`;
  frameworkComponents = {};
  @Input() gridOptions: GridOptions;
  lessRow = false;
  rowData :any= null;
  rowHeight = 20;
  selectedRows: any;
  noOfSelectedRows = 0;
  setResizeEvent = false;
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private router: Router
  ) {}
  public gridApi: GridApi;
  public gridColumnApi:any;
  tooltipShowDelay = 0;
  gridWidth = 700;
  timeout: any = null;
  pageName = "";
  totalTrds = null;
  ngOnInit() {}

  ngAfterViewInit() {}

  dateComparator(date1:any, date2:any) {
    var a = new Date(date1);
    var b = new Date(date2);
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  }

  onGridReady(params:any) {
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 2000);

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onRowSelected(event:any) {
    if (event.node.selected) {
      this.rowData[event.rowIndex].selected = true;
    } else {
      this.rowData[event.rowIndex].selected = false;
    }
    this.getSelectedData();
  }

  getSelectedData() {
    const filteredData:any = [];
    this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
      filteredData.push(rowNode.data);
    });
    this.selectedRows = filteredData.filter((_row) => _row.selected);
    this.noOfSelectedRows = this.selectedRows.length;
  }

  paginationChangeEvent(pageIndex:any) {
    this.gridApi.paginationGoToPage(pageIndex - 1);
    this.currentPageIndex = pageIndex;
  }
  changeRowsperPage(event:any) {
    const rowsPerPage = Number(event.target.value);
    this.NoOfitemsPerPage = rowsPerPage;
    this.gridApi.paginationSetPageSize(rowsPerPage);
  }
  onColumnResized() {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      this.gridApi.resetRowHeights();
      if (this.router.url === "/Specifications") {
        this.setResizeEvent = true;
        window.dispatchEvent(new Event("resize"));
      }
    }, 1000);
  }
  onColumnsChanged() {
    this.gridApi.resetRowHeights();
    this.gridApi.sizeColumnsToFit();
  }
  @HostListener("window:resize", ["$event"])
  onResize() {
    if (!this.setResizeEvent) {
      this.gridApi.sizeColumnsToFit();
      this.setResizeEvent = false;
    }
    this.gridApi.resetRowHeights();
  }
  onFirstDataRendered() {
    setTimeout(() => {
      this.gridApi.resetRowHeights();
      this.gridApi.sizeColumnsToFit();
    }, 200);
  }
}
