import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { Observable } from 'rxjs';
import {AgGirdHelperComponent, MyCellParams} from './ag-gird-helper/ag-gird-helper.component'
@Component({
  selector: 'app-ag-gird',
  templateUrl: './ag-gird.component.html',
  styleUrls: ['./ag-gird.component.scss']
})
export class AgGirdComponent  {

 // Each Column Definition results in one Column.
 //rowGroup -> Individual grouping of columns
 public columnDefs: ColDef[] = [
//    {headerName:'Groups',
//   showRowGroup: true,
// cellRenderer:'agGroupCellRenderer',
// // cellRendererParams:{
// // suppressCount:true,
// // checkbox:true,
// // innerRenderer:p => '<br>' +p.value + '</b>'
// // }
// },
   { field: 'make',
  //  rowGroup:true,
  //  hide:true,
    // cellRenderer:AgGirdHelperComponent,
    // cellRendererParams: {
    //   buttonText:'Make Button'
    // } as MyCellParams
  },
   { field: 'model',
  //  cellRenderer:AgGirdHelperComponent,
  //  cellRendererParams: {
  //    buttonText:'Model Button'
  //  }as MyCellParams
  },

   { field: 'price',
  //  filter: 'agSetColumnFilter',
  // //  cellRendererSelector
  // cellRenderer:(params:ICellRendererParams) => {
  //   if(params.value < 40000 ) {
  //     return `<b>1 ${params.value}</b>`

  //     // {component: UnderComponent}
  //   }
  //     return `<b>2 ${params.value}</b>`
  //     // {component: OverComponent}
  // } 
}
 ];

//  public gridOptions = {
//    groupDisplayType: 'singleColumn'
//  }

 // DefaultColDef sets props common to all Columns
 public defaultColDef: ColDef = {
   sortable: true,
   filter: true,
   enableRowGroup: true,
   resizable: true
 };
 
 // Data that gets displayed in the grid
 public rowData$!: Observable<any[]>;

 // For accessing the Grid's API
 @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

 constructor(private http: HttpClient) {}

 // Example load data from sever
 onGridReady(params: GridReadyEvent) {
   this.rowData$ = this.http
     .get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
 }

 // Example of consuming Grid Event
 onCellClicked( e: CellClickedEvent): void {
   console.log('cellClicked', e);
 }

 // Example using Grid's API
 clearSelection(): void {
   this.agGrid.api.deselectAll();
 }
}