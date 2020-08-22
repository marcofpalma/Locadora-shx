import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovemaisService } from '../../conect/movemais.service';
import { AutenticacaoService } from '../../autenticacao.service';
import { Alert } from 'selenium-webdriver';


@Component({
  selector: 'app-duplicidadepedagio',
  templateUrl: './duplicidadepedagio.component.html',
  styleUrls: ['./duplicidadepedagio.component.css']
})
export class DuplicidadepedagioComponent implements OnInit {

public datai = new Date();
public dataf = new Date();
public dataconsulta = new Date();
public idmovemais = 0;
public aguard = false

getPedagios: Array<any>;


  constructor(public router: Router,
              private movemaisService: MovemaisService,
              public autenticacaoService: AutenticacaoService
              ) { }

  ngOnInit() {

  this.idmovemais = this.autenticacaoService.getIdMovemais();
  if (this.idmovemais === 0) { this.router.navigate(['/']) }

   if ( this.autenticacaoService.getFiltros()) {
         this.dataconsulta = this.autenticacaoService.getFiltrosValor();
         this.datai = this.dataconsulta;
         this.dataf = this.dataconsulta;
         setTimeout( () => { this.click_consultar() }, 500);
  }
    }

  click_home() {
       this.router.navigate(['dashboard']);
  }

  click_consultar() {
      this.aguard = true;
      this.movemaisService.getpedagiosduplicados(this.idmovemais,this.datai,this.dataf).subscribe(dados => this.getPedagios = dados);
      setTimeout( () => { this.aguard = false; }, 9000);

     // alert(JSON.stringify(this.getPedagios));
  }
    Consultar_Divergencia(vdata: Date){
      
        this.autenticacaoService.postFiltros(vdata)
        setTimeout( () => { }, 1000);
        this.router.navigate(['/pedagios'])
        

    }

}