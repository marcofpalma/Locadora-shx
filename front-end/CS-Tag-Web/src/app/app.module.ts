import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule  } from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { OrderModule } from 'ngx-order-pipe'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { OutputSenhaComponent } from './output-senha/output-senha.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { routing } from './app.routing';
import { PedagioComponent } from './dashboard/pedagio/pedagio.component';
import { DuplicidadepedagioComponent } from './dashboard/duplicidadepedagio/duplicidadepedagio.component';
import { AuthService } from './output-senha/auth.service';
import { AppRouterModule } from './app.routing.module';
import { PlacaComponent } from './dashboard/placa/placa.component';
import { VerificasenhaService} from '../app/conect/verificasenha.service';
import { SenhasComponent } from './dashboard/senhas/senhas.component';
import { ImportacaoComponent } from './dashboard/importacao/importacao.component';
import { AutenticacaoService } from './autenticacao.service';
import { TarifasComponent } from './dashboard/tarifas/tarifas.component';
import { TabelasComponent } from './dashboard/tabelas/tabelas.component';
import { ValepedagioComponent } from './dashboard/valepedagio/valepedagio.component';
import { CarretaComponent } from './dashboard/carreta/carreta.component';
import { ViagemComponent } from './dashboard/viagem/viagem.component';
import { ControleviagemComponent } from './dashboard/controleviagem/controleviagem.component';

 



@NgModule({
  declarations: [
    AppComponent,
    OutputSenhaComponent,
    DashboardComponent,
    PedagioComponent,
    DuplicidadepedagioComponent,
    PlacaComponent,
    SenhasComponent,
    ImportacaoComponent,
    TarifasComponent,
    TabelasComponent,
    ValepedagioComponent,
    CarretaComponent,
    ViagemComponent,
    ControleviagemComponent
  ],
  imports: [
    BrowserModule,
    routing,
    AppRouterModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    OrderModule,
    NgxPaginationModule
  ],
  providers:[
    AuthService,
    VerificasenhaService,
    HttpClientModule,
    AutenticacaoService

  ],

  bootstrap: [AppComponent]
})


export class AppModule { 
  public usuarioidmovemais: number;
}
