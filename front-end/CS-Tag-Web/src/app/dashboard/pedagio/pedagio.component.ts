import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovemaisService } from '../../conect/movemais.service';
import { AutenticacaoService } from '../../autenticacao.service';
import { Placa } from '../../models/placeholder.model';


@Component({
  selector: 'app-pedagio',
  templateUrl: './pedagio.component.html',
  styleUrls: ['./pedagio.component.css']
})

export class PedagioComponent implements OnInit {

public paginaAtual = 1; // Dizemos que queremos que o componente quando carregar, inicialize na página 1.       

public datai = new Date();
public dataf = new Date(); 
public dataconsulta = new Date();
public idmovemais = 0;
public filtros = new Placa;
public aguard = false
public engate = false;
public totalpassagens = ''
public totalpassagensvl = ''


getPedagios: Array<any>;
getPlacas: Array<any>;
getSegmento: Array<any>;
getValePedagio: Array<any>;
getGrupo: Array<any>;
getSubGrupo: Array<any>;
getClientes: Array<any>;



  constructor(public router: Router,
              private movemaisService: MovemaisService,
              public autenticacaoService: AutenticacaoService,

              ) { }

  ngOnInit() {
  this.filtros.historico = 'Passagem';
  this.datai = new Date('2020/03/01');
  this.dataf = new Date('2020/05/01');

  this.idmovemais = this.autenticacaoService.getIdMovemais();
  if (this.idmovemais === 0) { this.router.navigate(['/']) }
  this.engate = this.autenticacaoService.getEngate();


  if ( this.autenticacaoService.getFiltros()) {
         this.dataconsulta = this.autenticacaoService.getFiltrosValor();
         this.datai = this.dataconsulta;
         this.dataf = this.dataconsulta;
         this.filtros.historico = '';
         setTimeout( () => { this.click_consultar() }, 500);
  }

  this.movemaisService.getveiculoplaca(this.idmovemais).subscribe(
         dados => this.getPlacas = dados);
  this.movemaisService.getveiculosegmento(this.idmovemais).subscribe(
         dados => this.getSegmento = dados);
  this.movemaisService.getveiculovalepedagio(this.idmovemais).subscribe(
         dados => this.getValePedagio = dados);
  this.movemaisService.getveiculogrupo(this.idmovemais).subscribe(
         dados => this.getGrupo = dados);
  this.movemaisService.getveiculosubgrupo(this.idmovemais).subscribe(
         dados => this.getSubGrupo = dados);
  this.movemaisService.getveiculocliente(this.idmovemais).subscribe(
         dados => this.getClientes = dados);

  this.filtros.segmento = '';
  this.filtros.placa = '';
  this.filtros.valepedagio = '';
  this.filtros.grupo = '';
  this.filtros.subgrupo = '';
  this.filtros.cliente = '';
  this.filtros.tarifa = '';


    }

  click_home() {
       this.router.navigate(['dashboard']);
  }

  click_consultar() {
         this.paginaAtual = 1;
         this.engate = this.autenticacaoService.getEngate();

         this.aguard = true;
         this.movemaisService.getpedagios(this.idmovemais
                                        , this.datai
                                        , this.dataf
                                        , this.filtros
                                   ).subscribe(dados => this.getPedagios = dados);
   
              
      
      
                                      // alert(JSON.stringify(this.getPedagios))                               
   
   setTimeout( () => { this.aguard = false; }, 18000);
   setTimeout( () => {this.VerificaTotal() } , 20000);
   
   
  }
VerificaTotal(){
      var formato = { minimumFractionDigits: 0 , style: 'currency', currency: 'BRL' }
      var totalq = this.getPedagios.length.toLocaleString('pt-BR', formato);
      this.totalpassagens = totalq.substring(3,totalq.length)

      var vltotal = 0
      for (let i = 0; i < this.getPedagios.length; i++) { vltotal += this.getPedagios[i].value}
      var formato = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
      this.totalpassagensvl = vltotal.toLocaleString('pt-BR', formato);

      
      var formato = { minimumFractionDigits: 0 , style: 'currency', currency: 'BRL' }

}

}