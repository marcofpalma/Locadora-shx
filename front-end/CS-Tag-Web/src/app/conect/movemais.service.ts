import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { Options } from 'selenium-webdriver/chrome';
import { Placa } from '../models/placeholder.model';
import { environment } from '../../environments/environment'
import { retry } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { timeout } from 'rxjs/operators';
var Ttimeout = 90000;


@Injectable({ 
  providedIn: 'root'
})
export class MovemaisService {

  servidor: string = environment.servAPI ;

  constructor(private http: HttpClient) { }

  getmovemais(): Observable<any> {
   return this.http.get(environment.APIMOVEMAIS + '/v1/getStatementPaged');
  }

  postmovemais( valorBody: any ): Observable<any> {
    return this.http.post(this.servidor + '/transaction', valorBody ).pipe(retry(1))
      
  }

  getpedagios(idclie: number, datain: Date, datafim: Date, vfiltro: Placa): Observable<any> {
    return this.http.post(this.servidor + '/vpassagens', {idcliente: idclie, datai: datain, dataf: datafim, filtros: vfiltro });
  }

  getpedagioseng(idclie: number, datain: Date, datafim: Date, vfiltro: Placa): Observable<any> {
    return this.http.post(this.servidor + '/vpassagenseng', {idcliente: idclie, datai: datain, dataf: datafim, filtros: vfiltro });
  }


  getpedagios2(idclie: number, datain: Date, datafim: Date): Observable<any> {
    return this.http.post(this.servidor + '/vpassagens2', {idcliente: idclie, datai: datain, dataf: datafim });
  }

  getpedagios3(idclie: number, datain: Date, datafim: Date): Observable<any> {
    return this.http.post(this.servidor + '/vpassagens3', {idcliente: idclie, datai: datain, dataf: datafim });
  }

  getpedagios4(idclie: number, datain: Date, datafim: Date): Observable<any> {
    return this.http.post(this.servidor + '/vpassagens4', {idcliente: idclie, datai: datain, dataf: datafim });
  }

  getpedagiosduplicados(idclie: number, datain: Date, datafim: Date): Observable<any> {
    return this.http.post(this.servidor + '/vpassagensduplicadas', {idcliente: idclie , datai: datain, dataf: datafim});
  }

  gettarifas(idclie: number, datain: Date, datafim: Date): Observable<any> {
    return this.http.post(this.servidor + '/vtarifas', {idcliente: idclie, datai: datain, dataf: datafim});
  }

  /** placas veiculos */

  getplacas(idclie: number): Observable<any> {
    return this.http.post(this.servidor + '/vveiculos', {idcliente: idclie});
  }
  getplaca(idclie: number, idplaca: string): Observable<any> {
    return this.http.post(this.servidor + '/vveiculo', {idcliente: idclie, placa: idplaca });
  }

  postplaca( valorBody: any ): Observable<any> {
    return this.http.post(this.servidor + '/veiculo', valorBody );
  }

  updateplaca( valorBody: any ): Observable<any> {
    return this.http.post(this.servidor + '/upveiculo', valorBody );
  }

  deleteplaca( vplaca: string): Observable<any> {
    return this.http.post(this.servidor + '/dveiculo', {placa: vplaca} );
  }

/* grupos */

  getveiculoplaca(idclie: number): Observable<any> {
    return this.http.post(this.servidor + '/vveiculo/placas', {idcliente: idclie});
  }
  getveiculosegmento(idclie: number): Observable<any> {
    return this.http.post(this.servidor + '/vveiculo/segmento', {idcliente: idclie});
  }
  getveiculovalepedagio(idclie: number): Observable<any> {
    return this.http.post(this.servidor + '/vveiculo/valepedagio', {idcliente: idclie});
  }
  getveiculocliente(idclie: number): Observable<any> {
    return this.http.post(this.servidor + '/vveiculo/cliente', {idcliente: idclie});
  }
  getveiculogrupo(idclie: number): Observable<any> {
    return this.http.post(this.servidor + '/vveiculo/grupo', {idcliente: idclie});
  }
  getveiculosubgrupo(idclie: number): Observable<any> {
    return this.http.post(this.servidor + '/vveiculo/subgrupo', {idcliente: idclie});
  }

/*dashboard */

  getdshboardplacas(idclie: number, datain: Date, datafim: Date): Observable<any> {
      return this.http.post(this.servidor + '/dashborad/placa', {idcliente: idclie, datai: datain, dataf: datafim});
    }
  getdshboardSegmento(idclie: number, datain: Date, datafim: Date): Observable<any> {
      return this.http.post(this.servidor + '/dashborad/segmento', {idcliente: idclie, datai: datain, dataf: datafim});
    }
  getdshboardCliente(idclie: number, datain: Date, datafim: Date): Observable<any> {
      return this.http.post(this.servidor + '/dashborad/cliente', {idcliente: idclie, datai: datain, dataf: datafim});
    }
  getdshboardGrupo(idclie: number, datain: Date, datafim: Date): Observable<any> {
      return this.http.post(this.servidor + '/dashborad/grupo', {idcliente: idclie, datai: datain, dataf: datafim});
    }
  getdshboardSubGrupo(idclie: number, datain: Date, datafim: Date): Observable<any> {
      return this.http.post(this.servidor + '/dashborad/subgrupo', {idcliente: idclie, datai: datain, dataf: datafim});
    }
  getdshboardValePedagio(idclie: number, datain: Date, datafim: Date): Observable<any> {
      return this.http.post(this.servidor + '/dashborad/valepedagio', {idcliente: idclie, datai: datain, dataf: datafim});
    }


/*tabelas */
 getvTabelas(id: number, vdata: Date): Observable<any> {
      return this.http.post(this.servidor + '/vtabela', {id_tabela: id, data: vdata});
    }

  getvTabelas2(id: number): Observable<any> {
      return this.http.post(this.servidor + '/vtabela2', {id_tabela: id});
    }

 postTabelas(valorBody: any ): Observable<any> {
      return this.http.post(this.servidor + '/tabela', valorBody);
    }


  /*Diferencas */
  postDiferencas(valorBody: any ): Observable<any> {
      return this.http.post(this.servidor + '/diferencas', valorBody);
    }

 getvDiferencas(id: number, vdatai: Date, vdataf: Date): Observable<any> {
      return this.http.post(this.servidor + '/vdiferencas', {idcliente: id, datai: vdatai, dataf: vdataf});
    }
getvDiferencasTotal(id: number, vdatai: Date, vdataf: Date): Observable<any> {
      return this.http.post(this.servidor + '/vdiferencastotal', {idcliente: id, datai: vdatai, dataf: vdataf});
    }



/* usuario */


  postUsuario( valorBody: any ): Observable<any> {
    return this.http.post(this.servidor + '/senha', valorBody );
  }

  updateUsuario( valorBody: any ): Observable<any> {
    return this.http.post(this.servidor + '/upsenha', valorBody );
  }

  deleteUsuario( valorBody: any): Observable<any> {
    return this.http.post(this.servidor + '/dveiculo', valorBody );
  }

  /* categoria */

   getCategoria(vid: number): Observable<any> {
      return this.http.post(this.servidor + '/vcategoria', {id: vid});
    }
   getCategorias(): Observable<any> {
      return this.http.post(this.servidor + '/vcategorias', {});
    }
   getCategoriasAssID(valorBody: any): Observable<any> {
      return this.http.post(this.servidor + '/vcategoriaAssID', valorBody );
    }
   getCategoriasAssIDs(): Observable<any> {
      return this.http.post(this.servidor + '/vcategoriaAssIDs', {} );
    }



/* Vale Pedagio */
  postValePedagio( valorBody: any ): Observable<any> {
    return this.http.post(this.servidor + '/valepedagio', valorBody );
  }
   getValePedagio(id: number, vdatai: Date, vdataf: Date ): Observable<any> {
      return this.http.post(this.servidor + '/vvalepedagio', {idcliente: id, datai: vdatai, dataf: vdataf} );
    }
  getValePedagio2(id: number, vdatai: Date, vdataf: Date, vplaca: string, vViagem : string, vfiltro:string): Observable<any> {
      return this.http.post(this.servidor + '/vvalepedagio2', {idcliente: id, datai: vdatai, dataf: vdataf, placa: vplaca, VIAGEM: vViagem , filtro: vfiltro} );
    }
getValePedagioDetalhes(id: number, vdatai: Date, vdataf: Date, vviagem: string  ): Observable<any> {
      return this.http.post(this.servidor + '/vvalepedagio/detalhes', {idcliente: id, datai: vdatai, dataf: vdataf, viagem: vviagem} );
    }
getValePedagioPlacas(idcli: number, dti: Date, dtf: Date): Observable<any> {
      return this.http.post( this.servidor + '/vvalepedagio/placa', {idcliente: idcli, datai :dti, dataf :dtf } );
    }
getValePedagioViagens(idcli: number, vplaca: string, dti: Date, dtf: Date): Observable<any> {
      return this.http.post( this.servidor + '/vvalepedagio/viagem', {idcliente: idcli, placa: vplaca, datai :dti, dataf :dtf } );
    }




 /** placas carreta */

  getCarretas(idclie: number): Observable<any> {
    return this.http.post(this.servidor + '/vcarretas', {idcliente: idclie});
  }
  getCarreta(idclie: number, idplaca: string): Observable<any> {
    return this.http.post(this.servidor + '/vcarreta', {idcliente: idclie, placa: idplaca });
  }

  postCarreta( valorBody: any ): Observable<any> {
    return this.http.post(this.servidor + '/carreta', valorBody );
  }

  updateCarreta( valorBody: any ): Observable<any> {
    return this.http.post(this.servidor + '/upcarreta', valorBody );
  }

  deleteCarreta( vplaca: string): Observable<any> {
    return this.http.post(this.servidor + '/dcarreta', {placa: vplaca} );
  }


   /** viagens */
  getViagens(idclie: number): Observable<any> {
    return this.http.post(this.servidor + '/vviagens', {idcliente: idclie});
  }

  getViagens2(id: number, vdatai: Date, vdataf: Date, vplaca: string, vViagem : string, vmotorista : string, vCliente: string): Observable<any> {
    return this.http.post(this.servidor + '/vviagens2', {idcliente: id, datai: vdatai, dataf: vdataf, placa: vplaca, VIAGEM: vViagem, motorista: vmotorista, cliente: vCliente });
  }

  getViagens2Placa(id: number, vdatai: Date, vdataf: Date): Observable<any> {
    return this.http.post(this.servidor + '/vviagens2/placas', {idcliente: id, datai: vdatai, dataf: vdataf});
  }

  getViagens2Viagem(id: number, vdatai: Date, vdataf: Date, vplaca: string): Observable<any> {
    return this.http.post(this.servidor + '/vviagens2/viagem', {idcliente: id, datai: vdatai, dataf: vdataf, placa: vplaca});
  }

  getViagens2Cliente(id: number, vdatai: Date, vdataf: Date, vcliente: string): Observable<any> {
    return this.http.post(this.servidor + '/vviagens2/cliente', {idcliente: id, datai: vdatai, dataf: vdataf, cliente: vcliente});
  }

  getViagens2Motorista(id: number, vdatai: Date, vdataf: Date, vmotorista: string): Observable<any> {
    return this.http.post(this.servidor + '/vviagens2/motorista', {idcliente: id, datai: vdatai, dataf: vdataf, motorista: vmotorista});
  }


  getViagem(idclie: number, idun: string): Observable<any> {
    return this.http.post(this.servidor + '/vviagem', {idcliente: idclie, IDUNICO: idun });
  }

  postViagem( valorBody: any ): Observable<any> {
    return this.http.post(this.servidor + '/viagem', valorBody );
  }

  updateViagem( valorBody: any ): Observable<any> {
    return this.http.post(this.servidor + '/upviagem', valorBody );
  }

  deleteViagem( idun: number): Observable<any> {
    return this.http.post(this.servidor + '/dviagem', {IDUNICO: idun} );
  }

  /* mensalidades*/
    getmensalidades(idclie: number, Vano: number): Observable<any> {
    return this.http.post(this.servidor + '/mensalidades', {idcliente: idclie, ano: Vano}).pipe( timeout(900000));
  }


}