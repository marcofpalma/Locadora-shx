import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovemaisService } from '../../conect/movemais.service';
import { AutenticacaoService } from '../../autenticacao.service';
import * as XLSX from 'xlsx';
import { Alert } from 'selenium-webdriver';
import { categorias  } from '../../../environments/Categoria'
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-importacao',
  templateUrl: './importacao.component.html',
  styleUrls: ['./importacao.component.css']
})
export class ImportacaoComponent implements OnInit {
public paginaAtual = 1; // Dizemos que queremos que o componente quando carregar, inicialize na página 1.       

public datai = new Date();
public dataf = new Date();
public idmovemais = 0;
public tipoOSA = Number();
public OSA = String();
public getCatCod = categorias;
public processando = 0;
public messagemProcessado = '';
public itemProcessado = '';
public engate = false;

public ckUpload = false;
public ckPassagem = false;
public ckDivergencias = false;
public ckMensalidade = false;
public ckVP = false;

public sUpload = '';
public sPassagem = '';
public sDivergencias = '';
public sMensalidade = '';
public sVP = '';

jsonDebitos: any;
jsonCreditos: any;


data_fatura = new Date();

arrayBuffer: any;
file: File;
jsonTabela: any;
jsonMensalidade: any;

getMovMais: Array<any>;
getPedagios: Array<any>;
getPedagiosTarifas: Array<any>;
getPedagiosEixos: Array<any>;
getCategorias: Array<any>;
getCategoriasAssId: Array<any>;


  constructor(public router: Router,
              private movemaisService: MovemaisService,
              public autenticacaoService: AutenticacaoService,
               ) { }

  ngOnInit() {
    this.idmovemais = this.autenticacaoService.getIdMovemais();
    this.engate = this.autenticacaoService.getEngate();

    this.movemaisService.getCategorias().subscribe(dados => this.getCategorias = dados)
    this.movemaisService.getCategoriasAssIDs().subscribe(dados => this.getCategoriasAssId = dados)

    this.tipoOSA = this.autenticacaoService.getTipoOSA();
    if ( this.tipoOSA === 1 ) { this.OSA = 'move+' }
    if ( this.tipoOSA === 2 ) { this.OSA = 'Sem Parar' }
    if ( this.tipoOSA === 3 ) { this.OSA = 'ConectCar' }
    if ( this.tipoOSA === 4 ) { this.OSA = 'move+ Excel' }

    if (this.idmovemais === 0) {this.router.navigate(['/'])}

    // alert(this.OSA + ' - ' + this.tipoOSA) 
  }

   click_home() {
       this.router.navigate(['dashboard']);
  }

 click_consultar() {

   this.movemaisService.getmovemais().subscribe(dados => this.getMovMais = dados.transactions.transaction)

 }

click_importar() {
    this.importar() 
    return
}

  importar() {

    const registros: Array<any> = this.getMovMais;
    //alert(JSON.stringify(registros))
    setTimeout(() => {console.log('ver registro') }, 6000000)
    let i = 0;
    let cont = 0;
    let cont2 = 0;
    const tplaca ='';
    for (i = 0; i < registros.length; i++) {
        /*verifica placa*/

        if (tplaca !== registros[i].plate) {
            tplaca: registros[i].plate ;

          this.movemaisService.postplaca({'idcliente': Number(this.idmovemais),
                      'placa':registros[i].plate,
                      'descricao': 'nao cadastrado' 
                          } ).subscribe(resposta => {});
        }
        cont++
        cont2++
        
       // if(cont2 === 500) { alert( i + 'pressione enter para continuar'); cont2 = 0; }

        
        if (cont === 500) {delay(60000)  ; cont = 0; }
        this.processando = i; 

        /*cadastra passagem */
        var PostStatus = ''
        
         var PJson =   {
                'idmovemais'             : Number(this.idmovemais),
                'idpassagem'             : Number(registros[i].id),
                'plate'                  : registros[i].plate,
                'classifiedCategory'     : registros[i].classifiedCategory,
                'occurrenceDate'         : registros[i].occurrenceDate,
                'processingDate'         : registros[i].processingDate,
                'description'            : registros[i].description,
                'type'                   : registros[i].type,
                'historicId'             : registros[i].historicId,
                'historic'               : registros[i].historic,
                'value'                  : registros[i].value /100 ,
                'associate'              : registros[i].associate,
                'classifiedNameCategory' : registros[i].classifiedNameCategory,
                'associateEntryId'       : registros[i].associateEntryId,
                'idunico'                : 'idcli:' + this.idmovemais + 'Dt:' + registros[i].occurrenceDate + 'des:' + registros[i].description + ' TP:' + registros[i].type + ' cat: ' + registros[i].classifiedCategory }
        
          this.movemaisService.postmovemais(PJson).subscribe(resposta => { PostStatus })
         //alert('status:' + PostStatus)   
          delay(1000);    
          console.log('ver registro' + i)    
           
           this.itemProcessado = i + ' - processados'
          
    }
   // alert('foram importados ' + i + ' registros com sucesso')
   this.messagemProcessado = 'foram importados ' + i + ' registros com sucesso'
   return
   }

  VerificaDivergencias(){

  /*  setTimeout(() => {
        const registros: Array<any> = this.getMovMais;

        for (let i = 0; i < registros.length; i++) {
          if (this.data_fatura < this.datai  ) {this.datai = this.data_fatura;} 
          if (this.data_fatura > this.dataf  ) {this.dataf = this.data_fatura;}
        }
    }, 3000);*/

    this.movemaisService.getpedagiosduplicados(this.idmovemais, this.datai, this.dataf).subscribe(dados => this.getPedagios = dados);
    setTimeout(() => { this.registraDuplicidades() }, 3000);
    this.movemaisService.getpedagios2(this.idmovemais ,this.datai , this.dataf).subscribe(dados => this.getPedagiosTarifas = dados);
    setTimeout(() => { this.registraDiferencaTarifa()}, 6000);
   
   if(this.engate === false) {
      this.movemaisService.getpedagios3(this.idmovemais ,this.datai , this.dataf).subscribe(dados => this.getPedagiosEixos = dados);
      setTimeout(() => { this.registraDiferencaEixos()}, 9000);
   }  

    setTimeout(() => {this.click_importar()}, 1000);

    setTimeout(() => {this.ckDivergencias = true}, 10000);

  }

  registraDuplicidades(){
    this.movemaisService.getpedagiosduplicados(this.idmovemais,this.datai,this.dataf).subscribe(dados => this.getPedagios = dados);
      this.processando = 0;
      this.messagemProcessado = 'verificando duplicidades'


    const registros: Array<any> = this.getPedagios;
   // alert(JSON.stringify(registros))

    let i = 0;
    let cont =0;
    for (i = 0; i < registros.length; i++) {
        /*cadastra duplicidades */

        cont++
        //if( cont === 1000) { alert( i + ' pressione enter para continuar'); cont=0; }
                
        if (cont = 1000) {
          setTimeout(() => { }, 2000);
          cont =0;
        }
        this.processando = i;
        
        this.movemaisService.postDiferencas({
                  'idcliente'              : Number(this.idmovemais),
                  'fatura'                 : '123',
                  'data'                   : registros[i].occurrenceDate,
                  'descricao'              : 'passagem duplicada',
                  'tipo'                   : 'duplicada',
                  'qtde'                   : 1,
                  'valor'                  : registros[i].value,
                  'contestada'             : false,
                  'idclienteassociacao'    : "id" + this.idmovemais + ",placa:" + registros[i].plate + ",dt:" + registros[i].occurrenceDate + "vl:" + registros[i].value
              }).subscribe(resposta => {});
    }
  //  alert('foram registradas ' + i + ' duplicidades')
  this.sDivergencias = 'Dupl: ' +i ;

  }

registraDiferencaTarifa(){
  this.movemaisService.getpedagios2(this.idmovemais ,this.datai , this.dataf).subscribe(dados => this.getPedagiosTarifas = dados);
  this.processando = 0;
  this.messagemProcessado = 'verificando diferencas de tarifas'

    setTimeout( () => { }, 2500);
    const registros: Array<any> = this.getPedagiosTarifas;
    //alert(JSON.stringify(registros))

    let i = 0;
    let cont = 0;
    for (i = 0; i < registros.length; i++) {
        /*cadastra duplicidades */
        //if( cont === 1000) { alert( i + ' pressione enter para continuar'); cont=0; }
        cont++

        if (cont = 1000) {
          setTimeout(() => { }, 2000);
          cont =0;
        }
        this.processando = i;

        if(registros[i].value/10 !== registros[i].TARIFA) { 
          //if(i < 10){alert( i + '' + registros[i].value/10 + '|' + registros[i].TARIFA)}
          if((registros[i].TARIFA > 0.001) || (registros[i].TARIFA < -0.001)){ 
              this.movemaisService.postDiferencas({
                        'idcliente'              : Number(this.idmovemais),
                        'fatura'                 : '123',
                        'data'                   : registros[i].occurrenceDate,
                        'descricao'              : 'tarifa irregular',
                        'tipo'                   : 'tarifa',
                        'qtde'                   : 1,
                        'valor'                  : registros[i].value - registros[i].TARIFA,
                        'contestada'             : false,
                        'idclienteassociacao'    : "tarifa id" + this.idmovemais + ",placa:" + registros[i].plate + ",dt:" + registros[i].occurrenceDate + "vl:" + registros[i].value
                    }).subscribe(resposta => {});
          } //if 
        }//if
    }
    //alert('foram registradas ' + i + ' diferenças de tarifa')
    this.sDivergencias = this.sDivergencias + ' Dif: ' +i ;


  }
  
  registraDiferencaEixos(){
    if (this.engate === true) {
        this.movemaisService.getpedagios4(this.idmovemais ,this.datai , this.dataf).subscribe(dados => this.getPedagiosEixos = dados);
    }else{
        this.movemaisService.getpedagios3(this.idmovemais ,this.datai , this.dataf).subscribe(dados => this.getPedagiosEixos = dados);
    }

   this.processando = 0;
   this.messagemProcessado = 'verificando diferencas de eixos'

    const registros: Array<any> = this.getPedagiosEixos;
    //alert(JSON.stringify(registros))

    let i = 0;
    let i2 = 0;
    for (i = 0; i < registros.length; i++) {
    let cont =0;
    const eixoPassagem = parseInt(registros[i].classifiedNameCategory.substring(0,2));
     const eixoVeiculo = parseInt(registros[i].eixos.substring(0,2));

     //alert( 'passagem: ' + eixoPassagem + ' veiculo: ' + eixoVeiculo )

        cont++
       // if( cont === 1000) { alert( i + ' pressione enter para continuar'); cont=0; }
        if (cont = 1000) {
          setTimeout(() => { }, 2000);
          cont =0;
        }
        this.processando = i;

        
  //    if( eixoPassagem > eixoVeiculo  ) {      
              /*cadastra duplicidades */
              i2++;
              this.movemaisService.postDiferencas({
                        'idcliente'              : Number(this.idmovemais),
                        'fatura'                 : '123',
                        'data'                   : registros[i].occurrenceDate,
                        'descricao'              : 'Eixo irregular',
                        'tipo'                   : 'Eixo',
                        'qtde'                   : 1,
                        'valor'                  : registros[i].value - registros[i].TARIFA,
                        'contestada'             : false,
                        'idclienteassociacao'    : "eixo id" + this.idmovemais + ",placa:" + registros[i].plate + ",dt:" + registros[i].occurrenceDate + "vl:" + registros[i].value
                    }).subscribe(resposta => {});
  //          } /**if */             
    }
  //  alert('foram registradas ' + i2 + ' diferenças de eixos')

    this.sDivergencias = this.sDivergencias + ' Eixos: ' +i ;

  

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
            var first_sheet_name = workbook.SheetNames[4] 
            var worksheet = workbook.Sheets[first_sheet_name];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.jsonTabela = XLSX.utils.sheet_to_json(worksheet,{raw:true});
         //   alert(JSON.stringify(this.jsonTabela)); 
        }
        fileReader.readAsArrayBuffer(this.file);
        this.sUpload = 'registros: ' + this.jsonTabela.length()
        this.sUpload = ''
        this.ckUpload = true;
        return
}



ImportaSemParar() {


    const Nvregistros = new Array;
    const registros: Array<any> = this.jsonTabela;
    var NaoEncontrados = 0;
    var Processados = 0;
    var contstop = 0;

    for (let i = 0; i < registros.length; i++) {
    //for (let i = 0; i < 80; i++) {

    contstop ++
    if (contstop = 1000) {
      setTimeout(() => { }, 1000);
      contstop =0;
    }
    this.processando= i;
      const vJson = {
                  'idmovemais'             : this.idmovemais,
                  'idpassagem'             : null,
                  'plate'                  : registros[i].PLACA,
                  'classifiedCategory'     : registros[i].CATEG,
                  'occurrenceDate'         : registros[i].DATA.substring(6,10) + '-' +
                                             registros[i].DATA.substring(3,5) + '-' +
                                             registros[i].DATA.substring(0,2) + ' ' +
                                             registros[i].HORA,
                  'processingDate'         : registros[i].DATA.substring(6,10) + '-' +
                                             registros[i].DATA.substring(3,5) + '-' +
                                             registros[i].DATA.substring(0,2) + ' ' +
                                             registros[i].HORA,
                  'description'            : registros[i].PRACA,
                  'type'                   : 'D',
                  'historicId'             : 1101,
                  'historic'               : 'Passagem',
                  'value'                  : registros[i].VALOR * 100 ,
                  'associate'              : registros[i].RODOVIA ,
                  'classifiedNameCategory' : this.getVerificaCategoria(registros[i].CATEG) , //categoria
                  'associateEntryId'       : this.getVerificaAssID(registros[i].RODOVIA, registros[i].CATEG,registros[i].PRACA)   }

   //  if( i < 1){ alert('item proc' + JSON.stringify(vJson)) }
       Nvregistros.push(vJson)
       this.itemProcessado = i + ' - lidos'

       Processados ++
      if (vJson.associateEntryId === 'nao encontrado') { NaoEncontrados ++}
  
      

    }
    //alert(JSON.stringify(Nvregistros));

    this.getMovMais = Nvregistros;
    var oks = (Processados - NaoEncontrados)
    //alert('IDs processados: ' +  Processados + ' nao encontrados: ' + NaoEncontrados + ' ok: ' + oks);
    this.sPassagem = 'IDs processados: ' ;
    
    setTimeout(() => {this.ckPassagem = true;}, 2000);

   this.click_importar() 
   this.ckPassagem = true;
   return
  }

pad(num: number, size: number): string {
    let s = num + "";
    while ( s.length < size ) s = "0" + s;
    return s;
}

getVerificaCategoria(id: Number){
     for (let j = 0; j < this.getCategorias.length; j++) {
        if (Number(this.getCategorias[j].CATEGORY_ARTESP_ID) === Number(id)) {
          return this.getCategorias[j].NAME;
        } /*if */
     } /*for*/
  }
 
getVerificaAssID(rodovia: string , cat: number, PRACA: string ) {
  const km = this.ProcuraKM(PRACA)
  var rodovia2 = ''
  if ( rodovia.substr(0, 5) === 'VIA 0') { rodovia2 = this.RemoveEspacos(rodovia) }
                                    else { rodovia2 = rodovia}

  if ( rodovia.substr(0, 3) === 'CCR') { rodovia2 = rodovia.substring(4, rodovia.length)}
  if ( rodovia === 'VIAPAULISTA S.A') { rodovia2 = 'VIAPAULISTA'}
  if ( rodovia === 'CCR VIASUL') { rodovia2 = 'VIASUL'}
  if ( rodovia === 'TRANSBRASILIANA') { rodovia2 = 'RODOVIA TRANSBRASILIANA'}
  if ( rodovia === 'CONCESSIONARIA DE RODOVIAS DO SUL') { rodovia2 = 'ECOSUL'}
  if ( rodovia === 'EMPRESA CONC. DE RODOVIAS DO NORTE S/A') { rodovia2 = 'ECONORTE'}
  if ( rodovia === 'CONCESSIONÁRIA SPMAR S/A') { rodovia2 = 'SPMAR'} 
  if ( rodovia === 'CAMINHOS DO PARANÁ S.A') { rodovia2 = 'CAMINHOS DO PARANÁ'}

  if ( PRACA.substring(0, 16) === 'MARQUES DOS REIS') {return 'nao encontrado'}
 

  
 // alert('km result:  ' + km)
 // alert(JSON.stringify(this.getCategoriasAssId))

 /* 1a pesquiza */
    for (let k = 0; k < this.getCategoriasAssId.length; k++) {
          var catkm = this.RemoveMais(this.getCategoriasAssId[k].ROAD_ENTRY_KM);
         // if(k < 3) {alert(km +' = ' + catkm)} 
            if ((this.getCategoriasAssId[k].ASSOCIATE_COMP_KNOWN_NAME === rodovia2)
            && (Number(this.getCategoriasAssId[k].CATEGORY_ARTESP_ID) === Number(cat)) 
            && (Number(catkm) === Number(km)) ) {
                return this.getCategoriasAssId[k].ASSOCIATE_ID.toString()
                    + this.pad(this.getCategoriasAssId[k].ENTRY_ID.toString(), 4)

        } /* if */
    } /*for */
 
    /* 2a pesquiza */
    var rodovia3 = PRACA.substr(0,2) + ' ' + PRACA.substr(2,3);
    if(PRACA.substr(2,1) === ' ') { rodovia3 = PRACA.substr(0,2) + ' ' + PRACA.substr(3,3)}
                            else  { rodovia3 = PRACA.substr(0,2) + ' ' + PRACA.substr(2,3)}


  //  alert('rodovia3 ' + rodovia3 + ' = ' + PRACA ) 
    for (let k = 0; k < this.getCategoriasAssId.length; k++) {
          
          var ROAD_CODE2 = this.VerificaRodovia(this.getCategoriasAssId[k].ROAD_CODE );
          var categ = Number(this.getCategoriasAssId[k].CATEGORY_ARTESP_ID);
          var catkm = this.RemoveMais(this.getCategoriasAssId[k].ROAD_ENTRY_KM);
          if((km === 87 ) && (rodovia3 === 'SP 021')) { km: 86 } 
          
              if ((ROAD_CODE2 === rodovia3)
              && (Number(categ) === Number(cat)) 
              && (Number(catkm) === Number(km)) 
                 ) { return this.getCategoriasAssId[k].ASSOCIATE_ID.toString()
                          + this.pad(this.getCategoriasAssId[k].ENTRY_ID.toString(), 4)

          } /* if */
    } /*for */
   
          
  /* 3a pesquiza - sem rodovia e sem km*/
 /*    var vRodovia = rodovia2;
     var vCidade = this.ProcuraCidadeArq(PRACA);
     var vCategoria = cat;

     //alert( rodovia2 + '|' + vCidade + '|' + vCategoria )


     for (let k = 0; k < this.getCategoriasAssId.length; k++) {
              const fROAD_CODE = this.getCategoriasAssId[k].ASSOCIATE_COMP_KNOWN_NAME;
              const fDescricao = this.ProcuraCidade(this.getCategoriasAssId[k].DESCRICAO);
             // alert(fDescricao.normalize('NFD').replace(/[^a-zA-Zs]/g, "") + ' === ' + vCidade.toUpperCase().normalize('NFD').replace(/[^a-zA-Zs]/g, ""))
              if ((fROAD_CODE === vRodovia)
               && (fDescricao.normalize('NFD').replace(/[^a-zA-Zs]/g, "")  === vCidade.toUpperCase().normalize('NFD').replace(/[^a-zA-Zs]/g, "") )
               && (Number(this.getCategoriasAssId[k].CATEGORY_ARTESP_ID) === Number(vCategoria)) 
                 ) { return this.getCategoriasAssId[k].ASSOCIATE_ID.toString()
                          + this.pad(this.getCategoriasAssId[k].ENTRY_ID.toString(), 4)}

                    }
*/
//  alert('nao encontrado: | ' + catkm +' = ' + km + ' |praca: ' + PRACA + ' |rodovia: ' + ROAD_CODE2 + ' = ' + rodovia3 + ' |categoria: ' + cat  )
  return 'nao encontrado';
}
ProcuraKM(texto: string) {




    for (let i = 0; i < texto.length; i++) {
       if( texto.substr( i,  2) === 'KM') {
              for(let j = i + 3; j < texto.length; j++) {
                if ((texto.substr(j,1) === ',') || (texto.substr( j, 1) === '.') ||(texto.substr( j, 1) === ' ') ||(texto.substr( j, 1) === '+')) {
                    if(texto.substr( i + 3, 1) === ' ') {
                        // alert( 'ret1 ' + Number(texto.substr(i + 3, j)) + ' || '+ texto)
                        return Number(texto.substring(i + 3, j))
                     } else {
                        // alert( 'ret2 ' + Number(texto.substring(i + 2, j)) + ' || '+ texto)
                        return Number(texto.substring(i + 2, j))
                     }
                }
              }
          }
    }

      // BR101, 35+700, NORTE, TRÊS CACHOEIRAS
    for (let i = 0; i < texto.length; i++) {
       if(texto.substr(i, 1) === ',') {
          for(let j = i + 2; j < texto.length; j++) {
            if (texto.substr(j + 1, 1) === '+') {
                // alert( 'ret3 ' + Number(texto.substring(i + 1, j+1)) + ' || '+ texto)
                return Number(texto.substring(i + 1, j+1))
            }
          }
      }
    }


  //alert(texto)
  return "erro:" + texto
}

RemoveMais(texto: string){
  
    if (texto === '106+500')         { return '107'; }
    if (texto === '118.000')         { return '117'; }
    if (texto.substr(1, 2) === 'km') { return texto.substr(3, 3); }
    if (texto.substr(1, 2) === 'KM ') { return texto.substr(3, 3); }
    if (texto.substr(1, 1) === '+')  { return texto.substr(0, 1); }
    if (texto.substr(2, 1) === '+')  { return texto.substr(0, 2); }
    if (texto.substr(3, 1) === '+')  { return texto.substr(0, 3); }
    if (texto.substr(4, 1) === '+')  { return texto.substr(0, 4); }
    if (texto.substr(1, 1) === '.')  { return texto.substr(0, 1); }
    if (texto.substr(2, 1) === '.')  { return texto.substr(0, 2); }
    if (texto.substr(3, 1) === '.')  { return texto.substr(0, 3); }
    if (texto.substr(4, 1) === '.')  { return texto.substr(0, 4); }
  
  
  
  for (let i = 0; i < texto.length; i++) {
        if(( texto.substr( i + 1,  1 ) === '+' )||( texto.substr( i + 1 ,  1 ) === '.' ) ){
         // alert(texto + ' = ' + texto.substring(0 , i))
        return texto.substring(0 , i)
      } /*if */
    }/*for */
    // alert(texto) ;
    
    return texto;
  }
RemoveEspacos( texto: string) {
      var novaString = '';
      for( var i = 0; i < texto.length; i++ ) {
          if( texto.charAt(i) !== ' ') {
              novaString += texto.charAt(i);
          }
      }
      return novaString;
  }

  VerificaRodovia(texto: string) {
          if (texto.substr(0, 5) === 'BR376')  {return 'BR 376'}
          if (texto.substr(0, 5) === 'BR101')  {return 'BR 101'}
          if (texto.substr(0, 6) === 'BR 101') {return 'BR 101'}

          if ((texto.substr(2, 1) === ' ') || (texto.substr(2, 1) === '-') )
                 {return texto.substr(0, 2) + ' ' + texto.substr(3,3)}
          
          if (texto.substr(2, 1) !== ' ')
                 {return texto.substr(0, 2) + ' ' + texto.substr(2,3)}
                 

          return texto
  }

  PegaRodovia(texto: string){
    if (texto.substr(3,1) === ' ')
         {return texto.substr(0, 6) }
    else {return texto.substr(0, 2) + '' + texto.substr(2,3)}

  }
  ProcuraCidadeArq(texto: string) {
    for (let i = 0; i < texto.length; i++) {
      if (( texto.substr(i, 8) === ' - NORTE')
       || ( texto.substr(i, 8) === ' - OESTE')
       || ( texto.substr(i, 8) === ' - LESTE')
       || ( texto.substr(i, 6) === ' - SUL')
       || (( texto.substr(i, 3) === 'SUL'))
       || ( texto.substr(i, 5) === 'NORTE')
       || ( texto.substr(i, 5) === 'LESTE')
       || ( texto.substr(i, 5) === 'OESTE')
       || ( texto.substr(i, 2) === 'KM')
       || ( texto.substr(i, 2) === 'km')
       || ( texto.substr(i, 8) === 'RODOANEL'))
       {
          if (texto.substring(0, i - 1 ) === "Guararema")
              { return 'GUARAREMA SUL'}

          return texto.substring(0, i - 1 );
        }
      }
      for (let i = 0; i < texto.length; i++) {
           if(texto.substr(texto.length - i , 1) === ',') {
          //   alert(texto.substring(i,texto.length))
              return texto.substring(i,texto.length)
            }
      }

    return texto;
    }  

  ProcuraCidade(texto: string) {
    var vCidade = ''; 
    for (let i = 10; i < texto.length; i++) {
      if ( texto.substr(i,1) === '-') 
       { 
          vCidade = texto.substring(i+2,texto.length);
       }
    }   
    if (vCidade === "Guararema")
       { return 'GUARAREMA SUL'}

    if (vCidade === "Guararema")
              { return 'GUArarema Sul'}
  return vCidade.toUpperCase();

  }  

Upload_conect() {
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
            this.jsonTabela = XLSX.utils.sheet_to_json(worksheet,{raw:true});
            
            alert(JSON.stringify(this.jsonTabela)); 
        }
        fileReader.readAsArrayBuffer(this.file);
this.ckUpload = true;
}
 
Click_Importa_conect() {
    setTimeout(() => {this.ImportaConectCar()  }, 500);
}

ImportaConectCar() {

  


    const Nvregistros = new Array;
    const registros: Array<any> = this.jsonTabela;
    var NaoEncontrados = 0;
    var Processados = 0;
    var catg = '';
    
    for (let i = 0; i < registros.length; i++) {
    //for (let i = 0; i < 10; i++) {
  setTimeout( () => { catg = this.PegaCategoria(registros[i].Historico) }, 50);
      this.processando = i;
      var nvValor = 0;
      if( registros[i].Debito !== '') {
          var nvValor = this.ArrumaNumero(registros[i].Debito)
      }     

      var categoria = 0
      categoria = this.ProcuraCategoria(registros[i].Historico);
      
      const vJson = {
                  'idmovemais'             : this.idmovemais,
                  'idpassagem'             : null,
                  'plate'                  : registros[i].Veiculo,
                  'classifiedCategory'     : categoria ,
                  'occurrenceDate'         : registros[i].Data.substring(6,10) + '-' +
                                             registros[i].Data.substring(3,5) + '-' +
                                             registros[i].Data.substring(0,2) + ' ' +
                                             registros[i].Data.substring(14,22),
                  'processingDate'         : registros[i].Data.substring(6,10) + '-' +
                                             registros[i].Data.substring(3,5) + '-' +
                                             registros[i].Data.substring(0,2) + ' ' +
                                             registros[i].Data.substring(14,22),
                  'description'            : registros[i].Historico.substring(35,registros[i].Historico.length),
                  'type'                   : 'D',
                  'historicId'             : 1101,
                  'historic'               : 'Passagem CONECT',
                  'value'                  : nvValor, 
                  'associate'              : this.PegaRodovia2(registros[i].Historico.substring(35,registros[i].Historico.length),i) ,
                  'classifiedNameCategory' : this.BuscaCategoria(categoria),
                  'associateEntryId'       : null }

                  
     //if( i < 5){ alert('item proc' + JSON.stringify(vJson))}
     //if( i < 1){ alert(catg)}
     //if( registros[i].Debito === '') {alert('item proc' + JSON.stringify(vJson))}

       Nvregistros.push(vJson)
       Processados ++

      if (vJson.associateEntryId === 'nao encontrado') { NaoEncontrados ++}
      
    }
    //alert(JSON.stringify(Nvregistros));

    this.getMovMais = Nvregistros;
    var oks = (Processados - NaoEncontrados)
    alert('IDs processados: ' +  Processados + ' nao encontrados: ' + NaoEncontrados + ' ok: ' + oks);
  }

removeNR(texto: string) {
     for (let i = 0; i < texto.length; i++) {
       if ( texto.substr(i,2) === '\n'){
          return texto.substring(i+3,texto.length)
       }
     } 
    return texto 
}

PegaCategoria(texto: string) {
    for (let i = 40; i < texto.length; i++) {
       if ( texto.substr(i,4) === 'Cat.'){
          return texto.substr(i+5,2)
       }
     } 
    return '0'
}

Click_ImportaSemPararMensalidades() {
  this.getMovMais = [];
  setTimeout( () => {this.ImportaSemPararMensalidadesImpo(); }, 500);
  setTimeout( () => {this.ImportaSemPararMensalidadesSalvar() }, 2000);
  setTimeout( () => {this.click_importar();}, 3000);

}


ImportaSemPararMensalidadesImpo() {
  
  /* upload aba 0 pegar data fatura*/
     const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            var first_sheet_name = workbook.SheetNames[0]; // aba planilha 
            var worksheet = workbook.Sheets[first_sheet_name];
            var dataf = new Date(worksheet.B4.w)
            this.data_fatura = dataf;
            alert('dtf' + dataf);

        }
        fileReader.readAsArrayBuffer(this.file);

  /* pegar mensalidades */
    const fileReader2 = new FileReader();    
        fileReader2.onload = (e) => {
            this.arrayBuffer = fileReader2.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            var worksheet = workbook.Sheets['MENSALIDADES'];
            this.jsonMensalidade = XLSX.utils.sheet_to_json(worksheet,{raw:true});
          //  alert(JSON.stringify(this.jsonMensalidade));
        }
        fileReader2.readAsArrayBuffer(this.file);
        
    this.ImportaSemPararMensalidadesSalvar()
    return  
}

ImportaSemPararMensalidadesSalvar() {

  /* salvar  */

    const Nvregistros = new Array;
    const registros: Array<any> = this.jsonMensalidade;
    var NaoEncontrados = 0;
    var Processados = 0;
    var cont = 0
 
//    PLACA	TAG	PREFIXO	CATEG	REFERÊNCIA	VALOR

    for (let i = 0; i < registros.length; i++) {
    //for (let i = 0; i < 80; i++) {
      cont ++
      if (cont === 1000) { setTimeout(() => { }, 20000); cont = 0; }
      const vJson = {
                  'idmovemais'             : this.idmovemais,
                  'idpassagem'             : null,
                  'plate'                  : registros[i].PLACA,
                  'classifiedCategory'     : registros[i].CATEG,
                  'occurrenceDate'         : this.data_fatura ,
                  'processingDate'         : this.data_fatura ,
                  'description'            : 'tag ' + registros[i].TAG,
                  'type'                   : 'D',
                  'historicId'             : 1332,
                  'historic'               : 'MENSALIDADE SEMPARAR',
                  'value'                  : registros[i].VALOR * 100,
                  'associate'              : '' ,
                  'classifiedNameCategory' : '',
                  'associateEntryId'       : '',
                  'idunico'                : 'mensl semparar pl' + registros[i].PLACA + ' dt: ' + this.data_fatura + registros[i].VALOR }

      // if( i < 1){ alert('item proc' + JSON.stringify(vJson)) }
       Nvregistros.push(vJson)
       Processados ++
      if (vJson.associateEntryId === 'nao encontrado') { NaoEncontrados ++}

      if (this.datai > this.data_fatura) {this.datai = this.data_fatura; alert('dti: ' + this.datai)} 
      if (this.dataf < this.data_fatura) {this.dataf = this.data_fatura; alert('dtf: ' + this.dataf)}
      
    }
    //alert(JSON.stringify(Nvregistros));

    this.getMovMais = Nvregistros;
    var oks = (Processados - NaoEncontrados)
    //alert('IDs processados: ' +  Processados + ' nao encontrados: ' + NaoEncontrados + ' ok: ' + oks);
    this.sMensalidade = 'IDs processados: ' +  Processados ; 
    //this.click_importar();
this.ckMensalidade = true;
return
}

  ArrumaNumero(numero: string){
      if(numero === '') {return 0}
      for (let i = 0; i < numero.length; i++) {
        if( numero.substr(i, 1) === ',') {
         // alert(numero + ' | ' + numero.substring(0,i)  + numero.substring(i+1,numero.length))
           var nnumero = numero.substring(0,i) + numero.substring(i+1,numero.length)
           return  Number(nnumero);
        }
      }  
      
    return Number(numero);
  }


  ProcuraCategoria(texto: string){
     for (let i = 0; i < texto.length; i++) {
        if( ( texto.substr(i, 4) === 'cat.') || ( texto.substr(i, 4) === 'Cat.') || ( texto.substr(i, 4) === 'CAT.')  ) {
        //  alert('cat: ' + texto.substr(i + 5, 3))
         return Number(texto.substr(i + 5, 3));
        }
      }
      return 0
  }

  PegaRodovia2(texto: string,i: number){

    //if( i < 5) {alert (texto.substring(0,10) + '|' + 'NOVA DUTRA' )}
    if (texto.substring(0,38) === 'CONCES.DE ROD.OESTE DE SP VIAOESTE S/A') {return 'VIAOESTE'}
    if (texto.substring(0,14) === 'RODOANEL OESTE') {return 'RODOANEL'}
    if (texto.substring(0,10)  === 'NOVA DUTRA') {return 'NOVA DUTRA'}
    if (texto.substring(0,14)  === 'AUTOPISTA FERN') {return texto.substring(0,21)}
    if (texto.substring(0,7)   === 'AUTOBAN') {return 'AUTOBAN'}
    if (texto.substring(0,7)   === 'ECOVIAS') {return 'ECOVIAS'}
    if (texto.substring(0,5)   === 'SPMAR')   {return 'SPMAR'}
    if (texto.substring(0,7)   === 'SP VIAS') {return 'SPVIAS'}
    if (texto.substring(0,7)   === 'COLINAS') {return 'COLINAS'}

    


    // if (texto === '') {return ''}
    
    
     for (let i = 0; i < texto.length; i++) {
        if(texto.substr(i, 2) === '  ') {
          return texto.substring(0, i);
     }
    }
    return texto
   }   

   BuscaCategoria(codigo :number){
      return this.getCatCod[codigo]
   }
   
   
Click_Importa_conect_all(){

    this.messagemProcessado = 'processando aguarde'

    setTimeout(() => {this.Click_ImportaSemParar(); }, 4000);
    setTimeout(() => {this.Click_ImportaSemPararMensalidades(); }, 7000);
    //setTimeout(() => {this.VerificaDivergencias();}, 3000);

  ////this.messagemProcessado= 'processamenso finalizado'
 
  }
Click_ImportaSemParar() {
    this.itemProcessado = 'upload'
    setTimeout( () => { this.Upload()}, 500)
    this.itemProcessado = 'importando'

    this.ckUpload = true;
    setTimeout( () => {this.ImportaSemParar() }, 4000)
    return
}
/* impostação vale transporte VP */
Uploadvp() {
      const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            //var first_sheet_name = workbook.SheetNames[0];
            var first_sheet_name = workbook.SheetNames[6]
            var worksheet = workbook.Sheets[first_sheet_name];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.jsonDebitos = XLSX.utils.sheet_to_json(worksheet,{raw:true});
            //alert(JSON.stringify(this.jsonDebitos)); 
        }
        fileReader.readAsArrayBuffer(this.file);
        return
}

 Upload2vp() {
      const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            //var first_sheet_name = workbook.SheetNames[0];
            var first_sheet_name = workbook.SheetNames[11]
            var worksheet = workbook.Sheets[first_sheet_name];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.jsonCreditos = XLSX.utils.sheet_to_json(worksheet,{raw:true});
            //alert(JSON.stringify(this.jsonCreditos)); 
        }
        fileReader.readAsArrayBuffer(this.file);

        return

}


Click_ImportaSemPararVP() {
  this.messagemProcessado = 'processando VP...'
    this.Uploadvp();
    this.Upload2vp(); 
    setTimeout(() => {this.ImportaSemPararVP()  }, 3000);
}

ImportaSemPararVP() {


    const Nvregistros = new Array;
    const registros: Array<any> = this.jsonDebitos;
    var Processados = 0;

    // debitos
    for (let i = 0; i < registros.length; i++) {
    //for (let i = 0; i < 80; i++) {
      const vJson = {
                  'idcliente'              : this.idmovemais,
                  'TIPO'                   : "DEBITO",
                  'PLACA'                  : registros[i].PLACA,
                  'TAG'                    : registros[i].TAG,
                  'PREFIXO'                : registros[i].PREFIXO,
                  'MARCA'                  : registros[i].MARCA,
                  'CATEG'                  : registros[i].CATEG,
                  'DATA'                   : registros[i].DATA.substring(6,10) + '-' +
                                             registros[i].DATA.substring(3,5) + '-' +
                                             registros[i].DATA.substring(0,2) + ' ' +
                                             registros[i].HORA,
                  'DESCRICAO'              : 'PASSAGEM',
                  'RODOVIA'                : registros[i].RODOVIA ,
                  'PRACA'                  : registros[i].PRACA ,
                  'VALOR'                  : registros[i].VALOR ,
                  'VIAGEM'                 : registros[i].VIAGEM ,
                  'EMBARCADOR'             : registros[i].EMBARCADOR ,
                  'CNPJ'                   : registros[i].CNPJ ,
                  'IDUNICO'                : 'DEBITO IDCLI: ' + this.idmovemais + ' PL:' + registros[i].PLACA +" VIAGEM:" + registros[i].VIAGEM 
                                             + 'DATA: ' + registros[i].DATA + registros[i].HORA + 'VL: ' + registros[i].VALOR 

                }

   //  if( i < 1){ alert('item proc' + JSON.stringify(vJson)) }
       Nvregistros.push(vJson)
       Processados ++
      
    }
 
    // creditos
    const registros2: Array<any> = this.jsonCreditos;

    for (let i = 0; i < registros2.length; i++) {
    //for (let i = 0; i < 80; i++) {
      const vJson = {
                  'idcliente'              : this.idmovemais,
                  'TIPO'                   : "CREDITO",
                  'PLACA'                  : registros2[i].PLACA,
                  'TAG'                    : registros2[i].TAG,
                  'DATA'                   : registros2[i].DATA.substring(6,10) + '-' +
                                             registros2[i].DATA.substring(3,5) + '-' +
                                             registros2[i].DATA.substring(0,2) + ' ' +
                                             registros2[i].HORA,
                  'DESCRICAO'              : "Credito de VP",
                  'VIAGEM'                 : registros2[i].VIAGEM ,
                  'PRACA'                  : registros2[i].PRACA ,
                  'VALOR'                  : registros2[i].VALOR ,
                  'EMBARCADOR'             : registros2[i].EMBARCADOR ,
                  'CNPJ'                   : registros2[i].CNPJ ,
                  'IDUNICO'                : 'CREDITO IDCLI: ' + this.idmovemais + ' PL:' + registros2[i].PLACA +" VIAGEM:" + registros2[i].VIAGEM 
                                             + 'DATA: ' + registros2[i].DATA + registros2[i].HORA + 'VL: ' + registros2[i].VALOR 

                }

   //  if( i < 1){ alert('item proc' + JSON.stringify(vJson)) }
       Nvregistros.push(vJson)
       Processados ++
      
    }


    this.getMovMais = Nvregistros;
    this.sVP = 'IDs processados: ' +  Processados ;
    //alert('IDs processados: ' +  Processados );
    this.click_importarvp();


  }  
 

click_importarvp() {
    setTimeout(() => {this.importarvp()  }, 500);
}

  importarvp() {

 const registros: Array<any> = this.getMovMais;

    let i = 0;
    let cont = 0;
    const tplaca ='';
    for (i = 0; i < registros.length; i++) {
        /*verifica placa*/

           cont++
//        if( cont === 1000) { alert( i + 'pressione enter para continuar'); cont=0; }

        if (cont = 1000) {
          setTimeout(() => { }, 2000);
          cont =0;
        }


        /*cadastra passagem */
        this.movemaisService.postValePedagio({
                  'idmovemais'             : Number(this.idmovemais),
                  'idcliente'              : registros[i].idcliente,
                  'TIPO'                   : registros[i].TIPO,
                  'PLACA'                  : registros[i].PLACA,
                  'TAG'                    : registros[i].TAG,
                  'PREFIXO'                : registros[i].PREFIXO,
                  'MARCA'                  : registros[i].MARCA,
                  'CATEG'                  : registros[i].CATEG,
                  'DATA'                   : registros[i].DATA,
                  'DESCRICAO'              : registros[i].DESCRICAO,
                  'RODOVIA'                : registros[i].RODOVIA ,
                  'PRACA'                  : registros[i].PRACA ,
                  'VALOR'                  : registros[i].VALOR ,
                  'VIAGEM'                 : registros[i].VIAGEM ,
                  'EMBARCADOR'             : registros[i].EMBARCADOR ,
                  'CNPJ'                   : registros[i].CNPJ ,
                  'IDUNICO'                : registros[i].IDUNICO 
            }).subscribe(resposta => {});
            this.itemProcessado = 'registro: ' + i;
    }
    //alert('foram importados ' + i + ' registros com sucesso')
    
    this.ckVP = true;
    this.messagemProcessado = ' Vale Pegagio processado'
   }

   /* importação movemais excel */

  Click_Importa_MoveMais() { 
    this.itemProcessado = 'upload'
    setTimeout( () => { this.UploadMoveMais()}, 500)
    this.itemProcessado = 'importando'

    this.ckUpload = true;
    setTimeout( () => {this.ImportaMoveMais() }, 4000)
    return
}

UploadMoveMais() {
      const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            //var first_sheet_name = workbook.SheetNames[0];
            var first_sheet_name = workbook.SheetNames[1] 
            var worksheet = workbook.Sheets[first_sheet_name];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.jsonTabela = XLSX.utils.sheet_to_json(worksheet,{raw:true});
            alert(JSON.stringify(this.jsonTabela)); 
        }
        fileReader.readAsArrayBuffer(this.file);
        this.sUpload = 'registros: ' + this.jsonTabela.length()
        this.sUpload = ''
        this.ckUpload = true;
        return
}

ImportaMoveMais() {


    const Nvregistros = new Array;
    const registros: Array<any> = this.jsonTabela;
    var NaoEncontrados = 0;
    var Processados = 0;
    var contstop = 0;

    for (let i = 0; i < registros.length; i++) {
   // for (let i = 0; i < 10; i++) {

    contstop ++
    if (contstop = 1000) {
      setTimeout(() => { }, 1000);
      contstop =0;
    }
    this.processando= i;
    var vhistoricId = 1101 
    if(registros[i].TIPO === 'Estorno de Passagem'){vhistoricId = 2101}
      const vJson = {
                  'idmovemais'             : this.idmovemais,
                  'idpassagem'             : null,
                  'plate'                  : registros[i].PLACA,
                  'classifiedCategory'     : Number(registros[i].CATEGORIA.substr(3,2)),
                  'occurrenceDate'         : registros[i].OCORRENCIA.substring(6,10) + '-' +
                                             registros[i].OCORRENCIA.substring(3,5) + '-' +
                                             registros[i].OCORRENCIA.substring(0,2) + ' ' +
                                             registros[i].OCORRENCIA.substring(11,16),
                  'processingDate'         : registros[i].PROCESSAMENTO.substring(6,10) + '-' +
                                             registros[i].PROCESSAMENTO.substring(3,5) + '-' +
                                             registros[i].PROCESSAMENTO.substring(0,2) + ' ' +
                                             registros[i].PROCESSAMENTO.substring(11,16),
                  'description'            : registros[i].PRACA,
                  'type'                   : 'D', 
                  'historicId'             : vhistoricId, 
                  'historic'               : registros[i].TIPO,
                  'value'                  : Number(registros[i].VALOR * -100) ,
                  'associate'              : registros[i].RODOVIA ,
                  'classifiedNameCategory' : registros[i].CATEGORIA.substring(8,registros[i].CATEGORIA.length) , //categoria
                  'associateEntryId'       : this.getVerificaAssIDmv(registros[i].RODOVIA
                                                                    ,Number(registros[i].CATEGORIA.substr(3,2))
                                                                    ,registros[i].PRACA)   }

     //if( i < 4){ alert('item proc' + JSON.stringify(vJson)) }
       Nvregistros.push(vJson)
       this.itemProcessado = i + ' - lidos'

       Processados ++
      if (vJson.associateEntryId === 'nao encontrado') { NaoEncontrados ++}
  
      

    }
    //alert(JSON.stringify(Nvregistros));

    this.getMovMais = Nvregistros;
    var oks = (Processados - NaoEncontrados)
    //alert('IDs processados: ' +  Processados + ' nao encontrados: ' + NaoEncontrados + ' ok: ' + oks);
    this.sPassagem = 'IDs processados: ' ;
    
    setTimeout(() => {this.ckPassagem = true;}, 2000);

   this.click_importar() 
   this.ckPassagem = true;
   return
  }

getVerificaAssIDmv(rodovia: string , cat: number, PRACA: string ) {
  const km = this.ProcuraKM(PRACA)

  if ( rodovia.substr(0, 5) === 'VIA 0') { rodovia2 = this.RemoveEspacos(rodovia) }
                                    else { rodovia2 = rodovia}

  var rodovia2 = ''
  var nvPraca = ''
    for (let i = 0; i < PRACA.length; i++) {
      if(PRACA.substr(i,3) === 'Sul')   { nvPraca = PRACA.substring(0, i) + PRACA.substring(i + 6, PRACA.length) }   
      if(PRACA.substr(i,5) === 'Norte') { nvPraca = PRACA.substring(0, i) + PRACA.substring(i + 8, PRACA.length) }   
      if(PRACA.substr(i,5) === 'Oeste') { nvPraca = PRACA.substring(0, i) + PRACA.substring(i + 8, PRACA.length) }   
      if(PRACA.substr(i,5) === 'Leste') { nvPraca = PRACA.substring(0, i) + PRACA.substring(i + 8, PRACA.length) }   
      
    }  

   // alert(PRACA + '|' + nvPraca + ' || ' + cat)
    if(nvPraca !== '') { PRACA = nvPraca }

  
 // alert('km result:  ' + km)
 // alert(JSON.stringify(this.getCategoriasAssId))

  /* 1a pesquiza */
    for (let k = 0; k < this.getCategoriasAssId.length; k++) {
         // if(k < 3) {alert(km +' = ' + catkm)} 
            if ((this.getCategoriasAssId[k].DESCRICAO === PRACA)
            && (Number(this.getCategoriasAssId[k].CATEGORY_ARTESP_ID) === Number(cat)) ){
                return this.getCategoriasAssId[k].ASSOCIATE_ID.toString()
                    + this.pad(this.getCategoriasAssId[k].ENTRY_ID.toString(), 4)

        } /* if */ 
    } /*for */

 /* 2a pesquiza */
    for (let k = 0; k < this.getCategoriasAssId.length; k++) {
          var catkm = this.RemoveMais(this.getCategoriasAssId[k].ROAD_ENTRY_KM);
         // if(k < 3) {alert(km +' = ' + catkm)} 
            if ((this.getCategoriasAssId[k].ASSOCIATE_COMP_KNOWN_NAME === rodovia2)
            && (Number(this.getCategoriasAssId[k].CATEGORY_ARTESP_ID) === Number(cat)) 
            && (Number(catkm) === Number(km)) ) {
                return this.getCategoriasAssId[k].ASSOCIATE_ID.toString()
                    + this.pad(this.getCategoriasAssId[k].ENTRY_ID.toString(), 4)

        } /* if */
    } /*for */
 
    /* 3a pesquiza */
    var rodovia3 = PRACA.substr(0,2) + ' ' + PRACA.substr(2,3);
    if(PRACA.substr(2,1) === ' ') { rodovia3 = PRACA.substr(0,2) + ' ' + PRACA.substr(3,3)}
                            else  { rodovia3 = PRACA.substr(0,2) + ' ' + PRACA.substr(2,3)}


  //  alert('rodovia3 ' + rodovia3 + ' = ' + PRACA ) 
    for (let k = 0; k < this.getCategoriasAssId.length; k++) {
          
          var ROAD_CODE2 = this.VerificaRodovia(this.getCategoriasAssId[k].ROAD_CODE );
          var categ = Number(this.getCategoriasAssId[k].CATEGORY_ARTESP_ID);
          var catkm = this.RemoveMais(this.getCategoriasAssId[k].ROAD_ENTRY_KM);
          if((km === 87 ) && (rodovia3 === 'SP 021')) { km: 86 } 
          
              if ((ROAD_CODE2 === rodovia3)
              && (Number(categ) === Number(cat)) 
              && (Number(catkm) === Number(km)) 
                 ) { return this.getCategoriasAssId[k].ASSOCIATE_ID.toString()
                          + this.pad(this.getCategoriasAssId[k].ENTRY_ID.toString(), 4)

          } /* if */
    } /*for */
   
  return 'nao encontrado';
}

/** mensalidades move+ excel */


  Click_Importa_MoveMais_mensalidade() { 
    this.itemProcessado = 'upload'
    setTimeout( () => { this.UploadMoveMais_mensalidade()}, 500)
    this.itemProcessado = 'importando'

    //this.ckMensalidade = true;
    setTimeout( () => {this.ImportaMoveMais_mensalidade() }, 4000)
    return
}

UploadMoveMais_mensalidade() {
      const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            //var first_sheet_name = workbook.SheetNames[0];
            var first_sheet_name = workbook.SheetNames[2] 
            var worksheet = workbook.Sheets[first_sheet_name];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.jsonTabela = XLSX.utils.sheet_to_json(worksheet,{raw:true});
            alert(JSON.stringify(this.jsonTabela)); 
        }
        fileReader.readAsArrayBuffer(this.file);
        this.sUpload = 'registros: ' + this.jsonTabela.length()
        this.sUpload = ''
        this.ckUpload = true;
        return
}

ImportaMoveMais_mensalidade() {


    const Nvregistros = new Array;
    const registros: Array<any> = this.jsonTabela;
    var NaoEncontrados = 0;
    var Processados = 0;
    var contstop = 0;

    for (let i = 0; i < registros.length; i++) {
   // for (let i = 0; i < 10; i++) {

    contstop ++
    if (contstop = 1000) {
      setTimeout(() => { }, 1000);
      contstop =0;
    }
    this.processando= i;
      const vJson = {
                  'idmovemais'             : this.idmovemais,
                  'idpassagem'             : null,
                  'plate'                  : registros[i].PLACA,
                  'classifiedCategory'     : Number(registros[i].CATEGORIA.substr(3,2)),
                  'occurrenceDate'         : registros[i].OCORRENCIA.substring(6,10) + '-' +
                                             registros[i].OCORRENCIA.substring(3,5) + '-' +
                                             registros[i].OCORRENCIA.substring(0,2) + ' ' +
                                             registros[i].OCORRENCIA.substring(11,16),
                  'processingDate'         : registros[i].PROCESSAMENTO.substring(6,10) + '-' +
                                             registros[i].PROCESSAMENTO.substring(3,5) + '-' +
                                             registros[i].PROCESSAMENTO.substring(0,2) + ' ' +
                                             registros[i].PROCESSAMENTO.substring(11,16),
                  'description'            : registros[i].CATEGORIA,
                  'type'                   : 'D', 
                  'historicId'             : 1332, 
                  'historic'               : registros[i].TIPO,
                  'value'                  : Number(registros[i].VALOR * -100) ,
                  'associate'              : '',
                  'classifiedNameCategory' : '',
                  'associateEntryId'       : '', 
                  'idunico'                : 'mensl mv pl' + registros[i].PLACA + ' dt: ' + registros[i].OCORRENCIA + (registros[i].VALOR * -1)   }


/*                  'type'                   : 'D',
                  'historicId'             : 1332,
                  'historic'               : 'MENSALIDADE SEMPARAR',
                  'value'                  : registros[i].VALOR * 100,
                  'associate'              : '' ,
                  'classifiedNameCategory' : '',
                  'associateEntryId'       : '',
                  'idunico'                : 'mensl semparar pl' + registros[i].PLACA + ' dt: ' + this.data_fatura + registros[i].VALOR }
*/

     //if( i < 4){ alert('item proc' + JSON.stringify(vJson)) }
       
      // if ( registros[i].TIPO === 'MENSALIDADE MOVE MAIS') {
          Nvregistros.push(vJson)
      // }
       this.itemProcessado = i + ' - lidos'

       Processados ++
      if (vJson.associateEntryId === 'nao encontrado') { NaoEncontrados ++}
  
      

    }
   // alert(JSON.stringify(Nvregistros));

    this.getMovMais = Nvregistros;
    var oks = (Processados - NaoEncontrados)
    //alert('IDs processados: ' +  Processados + ' nao encontrados: ' + NaoEncontrados + ' ok: ' + oks);
    this.sPassagem = 'IDs processados: ' ;
    
    setTimeout(() => {this.ckMensalidade = true;}, 2000);

   this.click_importar() 
   this.ckMensalidade = true;
   return
  }


} /*end total*/