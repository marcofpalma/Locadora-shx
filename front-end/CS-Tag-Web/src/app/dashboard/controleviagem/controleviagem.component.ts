import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovemaisService } from '../../conect/movemais.service';
import { AutenticacaoService } from '../../autenticacao.service';
import { parse } from 'querystring';
import { DatePipe } from '@angular/common';
import { isDate } from 'util';

import { Placa } from '../../models/placeholder.model';


@Component({
  selector: 'app-controleviagem',
  templateUrl: './controleviagem.component.html',
  styleUrls: ['./controleviagem.component.css'] 
})
export class ControleviagemComponent implements OnInit {


public datai = new Date();
public dataf = new Date();
public idmovemais = 0;
public placa = '';
public viagem = '';
public cliente = '';
public motorista = '';
public qtdeOK = 0;
public qtdeNegativo = 0;
public qtdePositivo = 0;
public vlOK = 0;
public vlNegativo = 0;
public vlPositivo = 0;
public svlOK = '';
public svlNegativo = '';
public svlPositivo = '';
public filtros = new Placa;
public aguard = false

getVP: Array<any>;
getdetalhes: Array<any>;
getPlacas: Array<any>; 
getViagens: Array<any>;
getMotorista: Array<any>;
getCliente: Array<any>;

public lMotorista = '';
public lCliente = '';
public lEixos = '';
public lEixos2 = '';
public LCARRETA = '';
public LCARRETA2 = '';
public LCARRETA3 = '';


  constructor(public router: Router,
              private movemaisService: MovemaisService,
              public autenticacaoService: AutenticacaoService
              ) { }

  ngOnInit() {

  this.idmovemais = this.autenticacaoService.getIdMovemais();
  if (this.idmovemais === 0) { this.router.navigate(['/']) }

    }

  click_home() {
       this.router.navigate(['dashboard']);
  }

  click_consultar() {
      
      this.aguard = true;

      this.movemaisService.getViagens2(this.idmovemais,this.datai,this.dataf, this.placa, this.viagem, this.motorista,this.cliente).subscribe(dados => this.getVP = dados);
      this.movemaisService.getViagens2Placa(this.idmovemais,this.datai,this.dataf).subscribe(dados => this.getPlacas = dados);
      this.movemaisService.getViagens2Viagem(this.idmovemais, this.datai, this.dataf, this.placa).subscribe(dados => this.getViagens = dados);
      this.movemaisService.getViagens2Cliente(this.idmovemais, this.datai, this.dataf, this.cliente).subscribe(dados => this.getCliente = dados);
      this.movemaisService.getViagens2Motorista(this.idmovemais, this.datai, this.dataf, this.motorista).subscribe(dados => this.getMotorista = dados);

      setTimeout( () => { this.aguard = false; }, 12000);

  }

click_detalhe(vdatai: Date, vdataf : Date, vplaca: string, lvMot: string, lvCli: string, vlEixos: string, vlEixos2: string, vlcarreta: string , vlcarreta2: string , vlcarreta3: string){

        this.lMotorista = lvMot;
        this.lCliente = lvCli;
        this.lEixos = vlEixos;
        this.lEixos2 = vlEixos2;
        this.LCARRETA = vlcarreta;
        this.LCARRETA2 = vlcarreta2;
        this.LCARRETA3 = vlcarreta3;


 

  this.filtros.segmento = '';
  this.filtros.placa = vplaca ;
  this.filtros.valepedagio = '';
  this.filtros.grupo = '';
  this.filtros.subgrupo = '';
  this.filtros.cliente = '';
  this.filtros.tarifa = '';
  this.filtros.historico = '';

  var nv_dataiS = vdatai.toString()
  var nv_dataiD = nv_dataiS.substr(0,10)
  var nvdatai   = new Date(nv_dataiD)

  var nv_datafS = vdataf.toString()
  var nv_datafD = nv_datafS.substr(0,10)
  var nvdataf   = new Date(nv_datafD)

                           this.movemaisService.getpedagios(this.idmovemais,nvdatai,nvdataf, this.filtros).subscribe(dados => this.getdetalhes = dados);



  }


} 

