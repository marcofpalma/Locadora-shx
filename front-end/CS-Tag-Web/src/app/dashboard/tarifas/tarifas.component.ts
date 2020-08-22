import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovemaisService } from '../../conect/movemais.service';
import { AutenticacaoService } from '../../autenticacao.service';
import { parse } from 'querystring';
import { DatePipe } from '@angular/common';
import { isDate } from 'util';


@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css']
})
export class TarifasComponent implements OnInit {


public ano =  0;
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

    }

  click_home() {
       this.router.navigate(['dashboard']);
  }

  click_consultar() {
      this.aguard = true;

      this.movemaisService.getmensalidades(this.idmovemais,this.ano).subscribe(dados => this.getPedagios = dados);
      setTimeout( () => {this.aguard = false;}, 60100);

  
  }


} 