import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../autenticacao.service';
import { MovemaisService } from '../conect/movemais.service';
import { Chart } from 'chart.js';
import { environment } from '../../environments/environment'
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
public idmovemais = 0;
public engate = false;

ambiente = environment.Ambiente;
exibgrafico:boolean = false;
exibtabela:boolean = false;
exibdivergencia:boolean = true;
sTOTAL = 0;
sVMAIS = 0;
sVMENOS = 0;



datai = new Date('2019/01/01');
dataf = new Date('2020/05/01');



getPlacas: Array<any>;
getSegmento: Array<any>;
getValePedagio: Array<any>;
getGrupo: Array<any>;
getSubGrupo: Array<any>;
getClientes: Array<any>;
getGrafico: Array<any>;
getDiferencas: Array<any>;
getDiferencasTotal: Array<any>;


  constructor(public router: Router,
              public autenticacaoService: AutenticacaoService ,
              private movemaisService: MovemaisService) { }


  @ViewChild('meuCanvas',  {static: true}) elemento: ElementRef;
  @ViewChild('meuCanvas2', {static: true}) elemento2: ElementRef;
  @ViewChild('meuCanvas3', {static: true}) elemento3: ElementRef;
  @ViewChild('meuCanvas4', {static: true}) elemento4: ElementRef;
  @ViewChild('meuCanvas5', {static: true}) elemento5: ElementRef;


  ngOnInit() {
      this.exibgrafico = true;

      this.idmovemais = this.autenticacaoService.getIdMovemais();
      this.engate = this.autenticacaoService.getEngate();
      if (this.idmovemais === 0) {this.router.navigate(['/'])}

      this.consultaDados();

      /* grafico */


  }



  click_home() {
       this.router.navigate(['/']);
  }


  consultaDados() {
      this.movemaisService.getdshboardplacas(this.idmovemais , this.datai, this.dataf).subscribe(
          dados => this.getPlacas = dados);
      this.movemaisService.getdshboardSegmento(this.idmovemais , this.datai, this.dataf).subscribe(
          dados => this.getSegmento = dados);
      this.movemaisService.getdshboardValePedagio(this.idmovemais , this.datai, this.dataf).subscribe(
          dados => this.getValePedagio = dados);
      this.movemaisService.getdshboardGrupo(this.idmovemais , this.datai, this.dataf).subscribe(
          dados => this.getGrupo = dados);
      this.movemaisService.getdshboardSubGrupo(this.idmovemais , this.datai, this.dataf).subscribe(
          dados => this.getSubGrupo = dados);
      this.movemaisService.getdshboardCliente(this.idmovemais , this.datai, this.dataf).subscribe(
          dados => this.getClientes = dados);
      this.movemaisService.getvDiferencas(this.idmovemais , this.datai, this.dataf).subscribe(
          dados => this.getDiferencas = dados);
      this.movemaisService.getvDiferencasTotal(this.idmovemais , this.datai, this.dataf).subscribe(
          dados => this.getDiferencasTotal = dados);

        setTimeout( () => { this.verificatotais() }, 4000);
        setTimeout( () => { this.verificatotais() }, 9000);

  }

 verificatotais(){
     setTimeout( () => { }, 2000);
      var formato = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
      this.sTOTAL  = this.getDiferencasTotal[0].total.toLocaleString('pt-BR', formato);
      this.sVMAIS  = this.getDiferencasTotal[0].VMAIS.toLocaleString('pt-BR', formato);
      this.sVMENOS = this.getDiferencasTotal[0].VMENOS.toLocaleString('pt-BR', formato);
         setTimeout( () => { }, 8000);
      var formato = { minimumFractionDigits: 2 , style: 'currency', currency: 'BRL' }
      this.sTOTAL  = this.getDiferencasTotal[0].total.toLocaleString('pt-BR', formato);
      this.sVMAIS  = this.getDiferencasTotal[0].VMAIS.toLocaleString('pt-BR', formato);
      this.sVMENOS = this.getDiferencasTotal[0].VMENOS.toLocaleString('pt-BR', formato);  
 } 
 geraGraficos(vAarray: any, vChat: any, vtype: string, vlabel: string) {

      const Vlabels = [];
      const Vvalues = [];
      const registros: Array<any> = vAarray;
      let i = 0;
      for (i = 0; i < registros.length; i++) {
        Vlabels.push(registros[i].descricao);
        Vvalues.push(registros[i].total); }
     new Chart(vChat , {
          type: vtype,
          data: {
              labels: Vlabels ,
              datasets: [{
                  label: vlabel,
                  data:  Vvalues ,
                  backgroundColor: [
                      'orange',
                      'DarkGreen',
                      'blueviolet',
                      'blue',
                      'brown',
                      'Chocolate',
                      'red',
                      'VioletRed',
                      'Orange',
                      'Sienna',
                      'PaleGreen',
                      'PeachPuff',
                      'blue',
                      'DarkGreen',
                      'red',
                      'Yellow',
                      'LimeGreen',
                      'Chocolate',
                      'red',
                      'VioletRed',
                      'Orange',
                      'Sienna',
                      'PaleGreen',
                      'PeachPuff',
                      'blue',
                      'DarkGreen',
                      'red',
                      'Yellow',
                      'LimeGreen',
                      'Chocolate',
                      'red',
                      'VioletRed',
                      'Orange',
                      'Sienna',
                      'PaleGreen',
                      'PeachPuff',
                      'blue',
                      'DarkGreen',
                      'red',
                      'Yellow',
                      'LimeGreen',
                      'Chocolate',
                      'red',
                      'VioletRed',
                      'Orange',
                      'Sienna',
                      'PaleGreen',
                      'PeachPuff'
                    ],

                  borderWidth: 1
              }]
          }
      });

 }

    geraGrafico() {
            setTimeout( () => { this.geraGraficos(this.getSegmento, this.elemento.nativeElement, 'polarArea', 'Segmentos');
                                this.geraGraficos(this.getClientes, this.elemento2.nativeElement, 'bar', 'Clientes');
                                this.geraGraficos(this.getValePedagio, this.elemento3.nativeElement, 'bar', 'Vales Pedagios');
                                this.geraGraficos(this.getGrupo, this.elemento4.nativeElement, 'polarArea', 'grupos');
                                this.geraGraficos(this.getPlacas, this.elemento5.nativeElement, 'bar', 'Placas');
            }, 500) ;

    }
    LimpaGrafico() { new Chart(this.elemento.nativeElement,{});
                    new Chart(this.elemento2.nativeElement,{});
                    new Chart(this.elemento3.nativeElement,{});
                    new Chart(this.elemento4.nativeElement,{});
                    new Chart(this.elemento5.nativeElement,{});


    }


    visualizaTabela() { this.exibgrafico = false;
                        this.exibtabela = true;
                        this.exibdivergencia = false; 
                        this.LimpaGrafico()}

    visualizaGrafico() { this.exibgrafico = true;
                        this.exibtabela = false;
                        this.exibdivergencia = false; 
                        this.geraGrafico()}

    visualizaDivergencia() { this.exibgrafico = false;
                            this.exibtabela = false;
                            this.exibdivergencia = true;
                            this.LimpaGrafico() }


    Consultar_Divergencia(vdata: Date,vtipo: string){
        this.autenticacaoService.postFiltros(vdata)
        if( vtipo !== 'duplicada'){
             this.router.navigate(['/pedagios'])
        }else{
             this.router.navigate(['/duplicidadePedagio'])
        }

    }
    Contestar_Divergencia(){}

}

