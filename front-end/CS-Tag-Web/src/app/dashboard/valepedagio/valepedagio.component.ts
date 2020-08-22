import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovemaisService } from '../../conect/movemais.service';
import { AutenticacaoService } from '../../autenticacao.service';
import { parse } from 'querystring';
import { DatePipe } from '@angular/common';
import { isDate } from 'util';

@Component({
  selector: 'app-valepedagio',
  templateUrl: './valepedagio.component.html',
  styleUrls: ['./valepedagio.component.css']
})
export class ValepedagioComponent implements OnInit {


public datai = new Date();
public dataf = new Date();
public idmovemais = 0;
public placa = '';
public viagem = '';
public qtdeOK = 0;
public qtdeNegativo = 0;
public qtdePositivo = 0;
public vlOK = 0;
public vlNegativo = 0;
public vlPositivo = 0;
public svlOK = '';
public svlNegativo = '';
public svlPositivo = '';
public filtro = '';


getVP: Array<any>;
getdetalhes: Array<any>;
getPlacas: Array<any>; 
getViagens: Array<any>;


  constructor(public router: Router,
              private movemaisService: MovemaisService,
              public autenticacaoService: AutenticacaoService
              ) { }

  ngOnInit() {

  this.idmovemais = this.autenticacaoService.getIdMovemais();
  if (this.idmovemais === 0) { this.router.navigate(['/']) }

    this.movemaisService.getValePedagioPlacas(this.idmovemais, this.datai, this.dataf).subscribe(dados => this.getPlacas = dados);
    this.movemaisService.getValePedagioViagens(this.idmovemais, this.placa,this.datai,this.dataf).subscribe(dados => this.getViagens = dados);

    setTimeout( () => { this.Calcula_divergencias(); }, 500);
    

    }

  click_home() {
       this.router.navigate(['dashboard']);
  }

  click_consultar() {
      this.movemaisService.getValePedagio2(this.idmovemais,this.datai,this.dataf, this.placa, this.viagem, this.filtro ).subscribe(dados => this.getVP = dados);
      this.movemaisService.getValePedagioPlacas(this.idmovemais,this.datai,this.dataf).subscribe(dados => this.getPlacas = dados);
      this.movemaisService.getValePedagioViagens(this.idmovemais, this.placa,this.datai,this.dataf).subscribe(dados => this.getViagens = dados);
      setTimeout( () => { this.Calcula_divergencias(); }, 2000);

  }

click_detalhe(vviagem: string){
      this.movemaisService.getValePedagioDetalhes(this.idmovemais,this.datai,this.dataf,vviagem).subscribe(dados => this.getdetalhes = dados);
  }

Calcula_divergencias(){

    const registros: Array<any> = this.getVP;
    this.qtdeOK = 0;
    this.qtdeNegativo = 0;
    this.qtdePositivo = 0; 
    this.vlOK = 0;
    this.vlNegativo = 0;
    this.vlPositivo = 0;

   
    for (let i = 0; i < registros.length; i++) {
      if((registros[i].total < 0.00000000001) && (registros[i].total > -0.0000000001)  ) {this.qtdeOK =  this.qtdeOK + 1;
                                                                          this.vlOK = this.vlOK + registros[i].CREDITO}
      else {
          if(registros[i].total > 0 ) {this.qtdePositivo = this.qtdePositivo + 1;
                                       this.vlPositivo = this.vlPositivo + registros[i].total}
          if(registros[i].total  < 0 ) {this.qtdeNegativo = this.qtdeNegativo + 1;
                                        this.vlNegativo = this.vlNegativo + registros[i].total}
      }
    }

   // this.vlOK = this.vlOK + this.vlPositivo + this.vlNegativo;
   // this.qtdeOK =  this.qtdeOK - this.qtdeNegativo + this.qtdePositivo
    var formato = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
    this.svlOK       = this.vlOK.toLocaleString('pt-BR', formato);
    this.svlPositivo = this.vlPositivo.toLocaleString('pt-BR', formato);
    this.svlNegativo = this.vlNegativo.toLocaleString('pt-BR', formato);
}

} 

