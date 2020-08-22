import { NgModule} from '@angular/core' ;
import { Routes, RouterModule} from '@angular/router' ;
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModuleWithProviders} from '@angular/core';
import { OutputSenhaComponent } from './output-senha/output-senha.component';



const APP_ROUTES: Routes = [
   {path: 'login', component: OutputSenhaComponent  },
   {path: 'dashboard', component: DashboardComponent },
   {path: '', component: OutputSenhaComponent  }
];

@NgModule({
   imports: [RouterModule.forRoot(APP_ROUTES)],
   exports: [RouterModule]
})

export class AppRouterModule {}
