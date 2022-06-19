import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { TableComponent } from "./table/table.component";
import { AgGridModule } from "ag-grid-angular";
@NgModule({
  declarations: [
    TableComponent,
  ],
  imports: [
    CommonModule,
    AgGridModule.withComponents([]),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    TableComponent,
    CommonModule,
  ],
  entryComponents: [
  ],
  providers: [DatePipe],
})
export class SharedModule {}
