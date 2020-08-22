import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovemaisService } from '../../conect/movemais.service';
import { AutenticacaoService } from '../../autenticacao.service';
import { Placa } from '../../models/placeholder.model';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-placa',
  templateUrl: './placa.component.html',
  styleUrls: ['./placa.component.css']
})
export class PlacaComponent implements OnInit {

arrayBuffer: any;
file: File;
jsonPlacas: any;

public paginaAtual = 1; // Dizemos que queremos que o componente quando carregar, inicialize na página 1.       

public exibimportacao: boolean = true;
public idmovemais = 0;
public placa: Placa = new Placa();
public update = false;
public placaAntiga: string;
public getEixos = [{"valor": "2 eixos, rodagem simples"},
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


Placas: Array<any>;


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
                      'placa': this.placa.placa,
                      'descricao': this.placa.descricao,
                      'marca': this.placa.marca,
                      'modelo': this.placa.modelo,
                      'ano': this.placa.ano,
                      'eixos': this.placa.eixos,
                      'eixos2': this.placa.eixos2,                      
                      'carreta': this.placa.carreta,
                      'segmento': this.placa.segmento,
                      'valepedagio': this.placa.valepedagio,
                      'grupo': this.placa.grupo,
                      'subgrupo': this.placa.subgrupo,
                      'cliente': this.placa.cliente,
                      'placaat': this.placaAntiga
        }

    if ( this.update === false ) {
         this.movemaisService.postplaca(JsonPlaca).subscribe(resposta => {});
      } else {
         this.movemaisService.updateplaca(JsonPlaca).subscribe(resposta => {});
       }

    this.click_cancelar();
  }

  click_cancelar() {
    this.placa = new Placa();
    this.update = false;
    setTimeout( () => { this.click_consultar() }, 500);

  }


  click_consultar() {
      this.movemaisService.getplacas(this.idmovemais).subscribe(dados => this.Placas = dados);
  }

  click_excluir(vplaca: string) {
    if (confirm('excluir placa : ' + vplaca)) {
            this.movemaisService.deleteplaca(vplaca).subscribe(resposta => {});
            this.click_cancelar();
      }
  }

  click_alterar(edPlaca:Placa){
    this.update = true;
    this.placaAntiga = edPlaca.placa;
    this.placa = edPlaca;
  }

  visualizaImportacao(){ 
    this.exibimportacao = ! this.exibimportacao; 
  }

Click_ImportaVeiculos() {
    setTimeout(() => {this. Upload()  }, 500);
    setTimeout(() => {this.ImportaVeiculos()  }, 1000);
    setTimeout(() => {this.importar()  }, 1500);
    setTimeout(() => {this.click_consultar(); this.exibimportacao = true  }, 2000);

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
    var Processados = 0;

    // debitos
    for (let i = 0; i < registros.length; i++) {
    //for (let i = 0; i < 80; i++) {
      const vJson = {
                  'idcliente'              : this.idmovemais,
                  'Placa'                  : registros[i].Placa,
                  'Descricao'              : registros[i].Descricao,
                  'Marca'                  : registros[i].Marca,
                  'Modelo'                 : registros[i].Modelo,
                  'Ano'                    : registros[i].Ano,
                  'EixosCarregado'         : registros[i].EixosCarregado,
                  'EixosVazil'             : registros[i].EixosVazio,
                  'Carreta'                : registros[i].Carreta ,
                  'Segmento'               : registros[i].Segmento ,
                  'Cliente'                : registros[i].Cliente ,
                  'ValePedagio'            : registros[i].ValePedagio ,
                  'Grupo'                  : registros[i].Grupo ,
                  'SubGrupo'               : registros[i].SubGrupo 

                }

    //if( i < 1){ alert('item proc' + JSON.stringify(vJson)) }
       Nvregistros.push(vJson)
       Processados ++
    }
       alert('item proc' + JSON.stringify(Nvregistros));
      this.jsonPlacas = Nvregistros;
    }  


  importar() {

 const registros: Array<any> = this.jsonPlacas;

    let i = 0;
    let cont = 0;
    for (i = 0; i < registros.length; i++) {
        /*verifica placa*/

           cont++
        if( cont === 1000) { alert( i + 'pressione enter para continuar'); cont=0; }

        /*cadastra passagem */
        this.movemaisService.updateplaca({
                'idcliente': registros[i].idcliente,
                'placa': registros[i].Placa,
                'descricao': registros[i].Descricao, 
                'marca': registros[i].Marca,
                'modelo': registros[i].Modelo,
                'ano': registros[i].Ano,
                'eixos': registros[i].EixosCarregado,
                'eixos2': registros[i].EixosVazil,                      
                'carreta': registros[i].Carreta,
                'segmento': registros[i].Segmento,
                'valepedagio': registros[i].valePedagio,
                'cliente': registros[i].Cliente,
                'grupo': registros[i].Grupo,
                'subgrupo': registros[i].SubGrupo,
                'placaat': registros[i].Placa                


            }).subscribe(resposta => {});
    }
    alert('foram importados ' + i + ' registros com sucesso')
    
   
   }  

} 


