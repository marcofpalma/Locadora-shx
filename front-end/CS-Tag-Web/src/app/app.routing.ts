import { Routes, RouterModule} from '@angular/router' ;
import { OutputSenhaComponent } from './output-senha/output-senha.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModuleWithProviders} from '@angular/core';
import { PedagioComponent } from './dashboard/pedagio/pedagio.component';
import { DuplicidadepedagioComponent } from './dashboard/duplicidadepedagio/duplicidadepedagio.component';
import { PlacaComponent } from './dashboard/placa/placa.component';
import { SenhasComponent } from './dashboard/senhas/senhas.component';
import { ImportacaoComponent } from './dashboard/importacao/importacao.component';
import { TarifasComponent } from './dashboard/tarifas/tarifas.component';
import { TabelasComponent } from './dashboard/tabelas/tabelas.component';
import { ValepedagioComponent } from './dashboard/valepedagio/valepedagio.component';
import { CarretaComponent } from './dashboard/carreta/carreta.component';
import { ViagemComponent } from './dashboard/viagem/viagem.component';
import { ControleviagemComponent } from './dashboard/controleviagem/controleviagem.component';



const APP_ROUTES: Routes = [
   {path: '', component: OutputSenhaComponent  },
   {path: 'login', component: OutputSenhaComponent  },
   {path: 'dashboard', component: DashboardComponent },
   {path: 'pedagios', component:  PedagioComponent},
   {path: 'duplicidadePedagio', component: DuplicidadepedagioComponent },
   {path: 'placa', component: PlacaComponent },
   {path: 'senhas', component: SenhasComponent },
   {path: 'impfatura', component: ImportacaoComponent },
   {path: 'tarifas', component: TarifasComponent },
   {path: 'tabelas', component: TabelasComponent },
   {path: 'valepedagio', component: ValepedagioComponent },
   {path: 'carreta', component: CarretaComponent },
   {path: 'viagem', component: ViagemComponent },
   {path: 'controleviagem', component: ControleviagemComponent }

   


];



export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
