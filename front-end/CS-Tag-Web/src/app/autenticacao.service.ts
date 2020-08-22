import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {


    public documento = '';
    public nome = '';
    public idmovemais = 0;
    public filtra = false;
    public datafiltro:Date;
    public tipoOSA = 0;
    public engate = false;
    public placa = '';


  constructor() {  }
       postIdMovemais(id:number) {
          this.idmovemais = id;
       }
       getIdMovemais() {
         return this.idmovemais;
       }
       postFiltros(vdata: Date) {
          this.datafiltro = vdata;
          this.filtra = true;
       }
       getFiltros() {
         return this.filtra;
       }
       getFiltrosValor() {
         this.filtra = false;
         return this.datafiltro;
       }
       postTipoOSA(vtipo:number){
         this.tipoOSA = vtipo;
       }
       getTipoOSA(){
         return this.tipoOSA;
       }
       postEngate(vEngate: boolean){
         this.engate = vEngate;
       }
       getPlaca(){
         return this.placa;
       }
       postPlaca(vPlaca: string){
         this.placa = vPlaca;
       }
       getEngate(){
         return this.engate;
       }


}
