import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovemaisService } from '../../conect/movemais.service';
import { AutenticacaoService } from '../../autenticacao.service';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-tabelas',
  templateUrl: './tabelas.component.html',
  styleUrls: ['./tabelas.component.css']
})
export class TabelasComponent implements OnInit {
public paginaAtual = 1; // Dizemos que queremos que o componente quando carregar, inicialize na página 1.       

public datai = new Date();
public dataf = new Date();
public idmovemais = 0;
public idtabela = 1;

arrayBuffer: any;
file: File;
jsonTabela: any;

getTabelas: Array<any>;


  constructor(public router: Router,
              private movemaisService: MovemaisService,
              public autenticacaoService: AutenticacaoService,
              private spinner: NgxSpinnerService
              ) { }

  ngOnInit() {


    
  this.click_consultar();

  this.idmovemais = this.autenticacaoService.getIdMovemais();
  if (this.idmovemais === 0) {this.router.navigate(['/']); }

    }

  click_home() {
       this.router.navigate(['dashboard']);
  }

  click_consultar() {
      this.movemaisService.getvTabelas2(this.idtabela).subscribe(dados => this.getTabelas = dados);
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
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.jsonTabela = XLSX.utils.sheet_to_json(worksheet,{raw:true});
            alert(JSON.stringify(this.jsonTabela)); 
        }
        fileReader.readAsArrayBuffer(this.file);

}

importar_excel() {


    const registros: Array<any> = this.jsonTabela;
    let i = 0;
    let cont = 0;
    for (i = 0; i < registros.length; i++) {
      /*cadastra tabela */
      cont ++;
      if (cont === 1000) {
        setTimeout( () => { }, 20000); 
        alert( 'registro: ' + i + ' aguarde processamento do lot e pressione enter');
        cont = 0;
      }
      setTimeout( () => { }, 200000);
        this.movemaisService.postTabelas({
            'id_tabela' 			  	      : this.idtabela,
            'datainicio'			  	      : this.datai,
            'datafim'					          : this.dataf,
            'ASSOCIATE_ID'				      : registros[i].ASSOCIATE_ID,
            'ASSOCIATE_COMP_KNOWN_NAME'	: registros[i].ASSOCIATE_COMP_KNOWN_NAME,
            'ENTRY_ID'			        		: registros[i].ENTRY_ID,
            'ROAD_CODE'			        		: registros[i].ROAD_CODE,
            'ROAD_ENTRY_KM'			      	: registros[i].ROAD_ENTRY_KM,
            'DESCRICAO'			        		: registros[i].DESCRICAO,
            'CATEGORY_ARTESP_ID'	    	: registros[i].CATEGORY_ARTESP_ID,
            'NAME'						          : registros[i].NAME,
            'TARIFA'					          : registros[i].TARIFA,
            'associateEntryId'		      : registros[i].ASSOCIATE_ID.toString()
                                         + this.pad(registros[i].ENTRY_ID.toString(),4)

              }).subscribe(resposta => {});
          
       setTimeout( () => { }, 20000000); 
    }
    alert('foram importados ' + i + ' registros com sucesso')
    this.click_consultar();
  }

pad(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

}