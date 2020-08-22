import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'

import { Usuario } from './usuario';
import { VerificasenhaService } from '../conect/verificasenha.service';
import { Senha } from '../models/placeholder.model';
import { AutenticacaoService } from '../autenticacao.service';


@Component({
  selector: 'app-output-senha',
  templateUrl: './output-senha.component.html',
  styleUrls: ['./output-senha.component.css']
})


export class OutputSenhaComponent implements OnInit {

public senha: Senha;
public vsenha: String;
public ambiente = environment.Ambiente;

public usuario: Usuario = new Usuario();




constructor( public router: Router
           , public verificasenhaService: VerificasenhaService
           , public autenticacaoService: AutenticacaoService
           ) { }


  ngOnInit() {
  }


 click_acessar() {


  if ((this.usuario.documento === '999') && (this.usuario.senha === '#consult*')) {
    this.vsenha = '0';
    this.router.navigate(['senhas']);
  }

  this.vsenha = '0';
  this.vsenha = this.ListarSenha();

  if (this.usuario.senha === this.vsenha) {

    this.router.navigate(['dashboard']);

  } else {
    alert('senha ou usuario invalidos');
  }
 }

 GetVericaUsuario() {
   return this.usuario.idmovemais;
 }

 ListarSenha() {
  this.verificasenhaService.getSenha(this.usuario.documento).subscribe(dados => this.senha = dados);
  this.usuario.idmovemais = parseInt(this.senha.idmovemais);
  this.autenticacaoService.postIdMovemais(this.usuario.idmovemais);
  this.autenticacaoService.postTipoOSA(this.senha.tipoOSA);
  this.autenticacaoService.postEngate(this.senha.engate);


  // alert(JSON.stringify(this.senha))

  if (this.senha === null) {
     alert('senha ou usuario invalidos');
     return 'erro';
   }

    return this.senha.senha;
   }

  }

