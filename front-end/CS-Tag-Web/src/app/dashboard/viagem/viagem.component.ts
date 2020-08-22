import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovemaisService } from '../../conect/movemais.service';
import { AutenticacaoService } from '../../autenticacao.service';
import { Placa } from '../../models/placeholder.model';
import * as XLSX from 'xlsx';
import { Alert } from 'selenium-webdriver';


@Component({
  selector: 'app-viagem',
  templateUrl: './viagem.component.html',
  styleUrls: ['./viagem.component.css']
})
export class ViagemComponent implements OnInit {

arrayBuffer: any;
file: File;
jsonPlacas: any;

public paginaAtual = 1; // Dizemos que queremos que o componente quando carregar, inicialize na página 1.       

public idmovemais = 0;
public placa = '';
public DATAI = new Date();
public DATAF = new Date();
public CARRETA = '';
public CARRETA2 = '';
public CARRETA3 = '';
public MOTORISTA = '';
public VIAGEM = '';
public CLIENTE = '';
public EIXOS = '';
public EIXOS2 = '';
public IDUNICO = 0;
public getEixos2 = [{"valor": "2 eixos, rodagem simples"},
{"valor": "3 eixos, rodagem simples"},
{"valor": "2 eixos, rodagem dupla"},
{"valor": "4 eixos, rodagem simples"},
{"valor": "3 eixos, rodagem dupla"},
{"valor": "4 eixos, rodagem dupla"},
{"valor": "5 eixos, rodagem dupla"},
{"valor": "6 eixos, rodagem dupla"},
{"valor": "7 eixos, rodagem dupla"},
{"valor": "8 eixos, rodagem dupla"},
{"valor": "9 eixos, rodagem dupla"},
{"valor": "10 eixos, rodagem dupla"},
{"valor": "11 eixos, rodagem dupla"},
{"valor": "12 eixos, rodagem dupla"},
{"valor": "13 eixos, rodagem dupla"},
{"valor": "14 eixos, rodagem dupla"},
{"valor": "15 eixos, rodagem dupla"},
{"valor": "16 eixos, rodagem dupla"},
{"valor": "17 eixos, rodagem dupla"},
{"valor": "18 eixos, rodagem dupla"},
{"valor": "19 eixos, rodagem dupla"},
{"valor": "20 eixos, rodagem dupla"},
{"valor": "21 eixos, rodagem dupla"},
{"valor": "22 eixos, rodagem dupla"},
{"valor": "23 eixos, rodagem dupla"},
{"valor": "24 eixos, rodagem dupla"},
{"valor": "25 eixos, rodagem dupla"},
{"valor": "26 eixos, rodagem dupla"},
{"valor": "27 eixos, rodagem dupla"},
{"valor": "28 eixos, rodagem dupla"},
{"valor": "29 eixos, rodagem dupla"},
{"valor": "30 eixos, rodagem dupla"},
{"valor": "31 eixos, rodagem dupla"},
{"valor": "32 eixos, rodagem dupla"},
{"valor": "33 eixos, rodagem dupla"},
{"valor": "34 eixos, rodagem dupla"},
{"valor": "35 eixos, rodagem dupla"},
{"valor": "36 eixos, rodagem dupla"},
{"valor": "37 eixos, rodagem dupla"},
{"valor": "38 eixos, rodagem dupla"},
{"valor": "39 eixos, rodagem dupla"},
{"valor": "40 eixos, rodagem dupla"},
{"valor": "41 eixos, rodagem dupla"},
{"valor": "42 eixos, rodagem dupla"},
{"valor": "43 eixos, rodagem dupla"},
{"valor": "44 eixos, rodagem dupla"},
{"valor": "45 eixos, rodagem dupla"},
{"valor": "46 eixos, rodagem dupla"},
{"valor": "47 eixos, rodagem dupla"},
{"valor": "48 eixos, rodagem dupla"} ]


public update = false;
public exibimportacao = false;




public getViagens: Array<any>;
public getPlacas: Array<any>;
public getPlacas2: Array<any>;
public getCarretas: Array<any>; 


  constructor(public router: Router,
              private movemaisService: MovemaisService,
              public autenticacaoService: AutenticacaoService
              ) { }

  ngOnInit() {

      this.idmovemais = this.autenticacaoService.getIdMovemais();
      if (this.idmovemais === 0) { this.router.navigate(['/']) };

      this.click_consultar();
     // alert(JSON.stringify(this.getEixos))
    }

  click_home() {
       this.router.navigate(['dashboard']);
  }

 
  click_salvar() {
    const JsonPlaca = {
                      'idcliente': Number(this.idmovemais),
                      'DATAI': this.DATAI,
                      'DATAF': this.DATAF,
                      'VIAGEM': this.VIAGEM,
                      'MOTORISTA': this.MOTORISTA,
                      'CLIENTE': this.CLIENTE,
                      'PLACA': this.placa,
                      'CARRETA': this.CARRETA,
                      'CARRETA2': this.CARRETA2,
                      'CARRETA3': this.CARRETA3,
                      'EIXOS' : this.EIXOS,
                      'EIXOS2' : this.EIXOS2,
                      'IDUNICO': 'id:' + Number(this.idmovemais) + ' viagem: ' + this.VIAGEM 
        }

    if ( this.update === false ) {
         this.movemaisService.postViagem(JsonPlaca).subscribe(resposta => {});
      } else {
         this.movemaisService.updateViagem(JsonPlaca).subscribe(resposta => {});
       }

    this.click_cancelar();
  }

  click_cancelar() {
    this.placa = '';
    this.DATAI = new Date();
    this.DATAF = new Date();
    this.CARRETA = '';
    this.CARRETA2 = '';
    this.CARRETA3 = '';
    this.MOTORISTA = '';
    this.VIAGEM = '';
    this.CLIENTE = '';
    this.EIXOS = '';
    this.EIXOS2 = '';


    this.update = false;
    setTimeout( () => { this.click_consultar() }, 500);

  }


  click_consultar() {
      this.movemaisService.getViagens(this.idmovemais).subscribe(dados => this.getViagens = dados);
      this.movemaisService.getplacas(this.idmovemais).subscribe(dados => this.getPlacas = dados);
      this.movemaisService.getCarretas(this.idmovemais).subscribe(dados => this.getCarretas = dados);
  }

  click_excluir(vplaca: string) {
    if (confirm('excluir viagem : ' + this.VIAGEM)) {
            this.movemaisService.deleteViagem(this.IDUNICO).subscribe(resposta => {});
            this.click_cancelar();
      }
  }

  click_alterar(edPlaca: any ){
    this.update = true;

    this.placa = edPlaca.placa;
    this.DATAI = edPlaca.DATAI;
    this.DATAF = edPlaca.DATAF;
    this.CARRETA = edPlaca.CARRETA;
    this.CARRETA2 = edPlaca.CARRETA2;
    this.CARRETA3 = edPlaca.CARRETA3;
    this.MOTORISTA = edPlaca.MOTORISTA;
    this.VIAGEM = edPlaca.VIAGEM;
    this.CLIENTE = edPlaca.CLIENTE;
    this.IDUNICO = edPlaca.IDUNICO;
    this.EIXOS = edPlaca.EIXOS;
    this.EIXOS2 = edPlaca.EIXOS2;


  }

  /* importacao */
    visualizaImportacao(){ 
    this.exibimportacao = ! this.exibimportacao; 
  }

Click_ImportaVeiculos() {
    this.movemaisService.getplacas(this.idmovemais).subscribe(dados => this.getPlacas2 = dados);
    setTimeout(() => {  }, 1000);
    setTimeout(() => {this.Upload()  }, 500);
    setTimeout(() => {this.ImportaVeiculos()  }, 3000);
    setTimeout(() => {this.importar()  }, 5000);
    setTimeout(() => {this.click_consultar(); this.exibimportacao = false  }, 6000);

}


incomingfile(event)  { this.file = event.target.files[0]; }

 Upload() {
      const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            //var first_sheet_name = workbook.SheetNames[0];
            var first_sheet_name = workbook.SheetNames[0]
            var worksheet = workbook.Sheets[first_sheet_name];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.jsonPlacas = XLSX.utils.sheet_to_json(worksheet,{raw:true});
          //  alert(JSON.stringify(this.jsonPlacas)); 
        }
        fileReader.readAsArrayBuffer(this.file);

}


ImportaVeiculos() {


    const Nvregistros = new Array;
    const registros: Array<any> = this.jsonPlacas;
    alert(JSON.stringify(registros))
    var Processados = 0;
    // debitos
    for (let i = 0; i < registros.length; i++) {
    //for (let i = 0; i < 80; i++) {

      const vJson = {
                  'idcliente'              : this.idmovemais,
                  'DATAI'                  : registros[i].DATAI.substring(6,10) + '-' +
                                             registros[i].DATAI.substring(3,5) + '-' +
                                             registros[i].DATAI.substring(0,2) + ' ' +
                                             registros[i].DATAI.substring(12,16) + ' ' ,
                  'DATAF'                  : registros[i].DATAF.substring(6,10) + '-' +
                                             registros[i].DATAF.substring(3,5) + '-' +
                                             registros[i].DATAF.substring(0,2) + ' ' +
                                             registros[i].DATAF.substring(12,16) + ' ' ,
                  'PLACA'                  : registros[i].PLACA,
                  'CARRETA'                : registros[i].CARRETA,
                  'CARRETA2'               : registros[i].CARRETA2,
                  'CARRETA3'               : registros[i].CARRETA3,
                  'MOTORISTA'              : registros[i].MOTORISTA,
                  'VIAGEM'                 : registros[i].VIAGEM,
                  'CLIENTE'                : registros[i].CLIENTE ,
                  'EIXOS'                  : this.VerificaEixoCarregado(registros[i].PLACA,registros[i].CARRETA,registros[i].CARRETA2,registros[i].CARRETA3) ,
                  'EIXOS2'                 : this.VerificaEixoVazio(registros[i].PLACA,registros[i].CARRETA,registros[i].CARRETA2,registros[i].CARRETA3) ,
                  'IDUNICO'                : 'id:' + Number(this.idmovemais) + ' viagem: ' + registros[i].VIAGEM + 'dt' + registros[i].DATAI

                }

    //if( i < 1){ alert('item proc' + JSON.stringify(vJson)) }
       Nvregistros.push(vJson)
       Processados ++
    }
       alert('item proc' + JSON.stringify(Nvregistros));
      this.jsonPlacas = Nvregistros;
      //alert('qtde de registros:' + this.jsonPlacas.length ) 
      return
    }  


  importar() {

 const registros: Array<any> = this.jsonPlacas;

    let i = 0;
    let cont = 0;
    for (i = 0; i < registros.length; i++) {
        /*verifica placa*/

           cont++
        if( cont === 500) { alert( i + 'pressione enter para continuar'); cont=0; }
       if( cont === 500) { setTimeout( () => {  }, 100000);}
 
        /*cadastra passagem */
         
          const vJson2 = {
                  'idcliente' : registros[i].idcliente,
                  'DATAI'     : registros[i].DATAI,
                  'DATAF'     : registros[i].DATAF,
                  'PLACA'     : registros[i].PLACA,
                  'CARRETA'   : registros[i].CARRETA,
                  'CARRETA2'  : registros[i].CARRETA2,
                  'CARRETA3'  : registros[i].CARRETA3,
                  'MOTORISTA' : registros[i].MOTORISTA, 
                  'VIAGEM'    : registros[i].VIAGEM,
                  'CLIENTE'   : registros[i].CLIENTE ,
                  'EIXOS'     : registros[i].EIXOS ,
                  'EIXOS2'    : registros[i].EIXOS2 ,
                  'IDUNICO'   : registros[i].IDUNICO } 
            
        setTimeout( () => {  }, 50)
        this.movemaisService.postViagem(vJson2 ).subscribe(resposta => {}); 
             setTimeout( () => { }, 200000);
 
        this.movemaisService.updateViagem(vJson2 ).subscribe(resposta => {}); 
    }
    alert('foram importados ' + i + ' registros com sucesso')
    
   return
   }  
/* eixos carregado */
   VerificaEixoCarregado(vPlaca: string, vCarreta :string, vCarreta2 :string, vCarreta3 :string){

    const registrosP: Array<any> = this.getPlacas2;
    var i = 0;
    var eixoPlacaCarreg = ''
    var eixoCarreta = ''
    var eixoCarreta2 = ''
    var eixoCarreta3 = ''
    for (i = 0; i < registrosP.length; i++) { 
        if (registrosP[i].placa = vPlaca) {
             eixoPlacaCarreg = registrosP[i].eixos;
            // alert('achei: ' + eixoPlacaCarreg );
             i = registrosP.length
        }
    }

    //alert('Vcarreta |' + vCarreta)

    var qtdeEixos = 0;

    if ((vCarreta === '') || (vCarreta === null)|| (vCarreta === 'NULL')|| (vCarreta === undefined)) {
       return eixoPlacaCarreg;
    } else {
       eixoCarreta = this.VerificaEixoCarretaCarregado(vCarreta) 
       qtdeEixos = Number(eixoPlacaCarreg.substr(0,1))
       qtdeEixos = qtdeEixos + Number(eixoCarreta.substr(0,1))
    }

    if ((vCarreta2 !== '') && (vCarreta2 !== null) && (vCarreta2 !== 'NULL') && (vCarreta2 !== undefined)) {
        eixoCarreta2 = this.VerificaEixoCarretaCarregado(vCarreta2)
        qtdeEixos = qtdeEixos + Number(eixoCarreta2.substr(0,1))
    }

    if ((vCarreta3 !== '') && (vCarreta3 !== null)&& (vCarreta3 !== 'NULL') && (vCarreta3 !== undefined)) {
        eixoCarreta3 = this.VerificaEixoCarretaCarregado(vCarreta3)
        qtdeEixos = qtdeEixos + Number(eixoCarreta3.substr(0,1))
    }
    qtdeEixos ++
    var TotalEixosCarregado = qtdeEixos + ' eixos, rodagem dupla'
   
   // alert('eixos:' + eixoPlacaCarreg + '|' + eixoCarreta + '|' + eixoCarreta2 + '|' + eixoCarreta3 + ' |= ' + TotalEixosCarregado ) 

    return TotalEixosCarregado;
   }

   VerificaEixoCarretaCarregado(vPlaca :string){
    const registrosC: Array<any> = this.getCarretas;
    var i = 0;
    for (i = 0; i < registrosC.length; i++) { 
        if (registrosC[i].placa = vPlaca) {
             return  registrosC[i].eixos;
            // alert('achei: ' + eixoPlacaCarreg );
        }
    }
   }

   /* eixos Vazio */
   VerificaEixoVazio(vPlaca: string, vCarreta :string, vCarreta2 :string, vCarreta3 :string){

    const registrosP: Array<any> = this.getPlacas2;
    var i = 0;
    var eixoPlacaCarreg = ''
    var eixoCarreta = ''
    var eixoCarreta2 = ''
    var eixoCarreta3 = ''
    for (i = 0; i < registrosP.length; i++) { 
        if (registrosP[i].placa = vPlaca) {
             eixoPlacaCarreg = registrosP[i].eixos2;
            // alert('achei: ' + eixoPlacaCarreg );
             i = registrosP.length
        }
    }

    //alert('Vcarreta |' + vCarreta)

    var qtdeEixos = 0;

    if ((vCarreta === '') || (vCarreta === null)||(vCarreta === 'NULL')|| (vCarreta === undefined)) {
       return eixoPlacaCarreg;
    } else {
       eixoCarreta = this.VerificaEixoCarretaVazio(vCarreta) 
       qtdeEixos = Number(eixoPlacaCarreg.substr(0,1))
       qtdeEixos = qtdeEixos + Number(eixoCarreta.substr(0,1))
    }

    if ((vCarreta2 !== '') && (vCarreta2 !== null) && (vCarreta2 !== 'NULL') && (vCarreta2 !== undefined)) {
        eixoCarreta2 = this.VerificaEixoCarretaVazio(vCarreta2)
        qtdeEixos = qtdeEixos + Number(eixoCarreta2.substr(0,1))
    }

    if ((vCarreta3 !== '') && (vCarreta3 !== null) && (vCarreta3 !== 'NULL') && (vCarreta3 !== undefined)) {
        eixoCarreta3 = this.VerificaEixoCarretaVazio(vCarreta3)
        qtdeEixos = qtdeEixos + Number(eixoCarreta3.substr(0,1))
    }

    qtdeEixos ++
    var TotalEixosCarregado = qtdeEixos + ' eixos, rodagem dupla'
   
   // alert('eixos:' + eixoPlacaCarreg + '|' + eixoCarreta + '|' + eixoCarreta2 + '|' + eixoCarreta3 + ' |= ' + TotalEixosCarregado ) 

    return TotalEixosCarregado;
   }

   VerificaEixoCarretaVazio(vPlaca :string){
    const registrosC: Array<any> = this.getCarretas;
    var i = 0;
    for (i = 0; i < registrosC.length; i++) { 
        if (registrosC[i].placa = vPlaca) {
             return  registrosC[i].eixos2;
            // alert('achei: ' + eixoPlacaCarreg );
        }
    }
  }
}