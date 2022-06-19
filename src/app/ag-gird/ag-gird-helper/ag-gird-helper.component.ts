import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

export interface MyCellParams {
buttonText ?: any;
}
@Component({
  selector: 'app-ag-gird-helper',
  templateUrl: './ag-gird-helper.component.html',
  styleUrls: ['./ag-gird-helper.component.scss']
})
export class AgGirdHelperComponent implements OnInit, ICellRendererAngularComp {
value:any
buttonText:"Default"
  agInit(params: ICellRendererParams & MyCellParams): void {
    console.log("params",params)
  this.value =  params.value
  this.buttonText = params.buttonText ?? 'Default'
  }

  refresh(params: ICellRendererParams & MyCellParams): boolean {
   return false;
  }
  constructor() { }

  ngOnInit(): void {
  }

  onClick(){
    alert('Cell value is' + this.value)
  }

}
