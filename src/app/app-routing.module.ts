import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FeaturesComponent } from "./features/features.component";
import { OktaComponent } from "./okta/okta.component";
import { AgGirdComponent } from "./ag-gird/ag-gird.component";
const routes: Routes = [
  {
    path: "",
    component: AgGirdComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
