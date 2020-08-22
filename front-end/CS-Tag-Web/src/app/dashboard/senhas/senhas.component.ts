import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VerificasenhaService } from '../../conect/verificasenha.service';
import { AutenticacaoService } from '../../autenticacao.service';
import { Usuario } from '../../output-senha/usuario'
import { MovemaisService } from '../../conect/movemais.service';


@Component({
  selector: 'app-senhas',
  templateUrl: './senhas.component.html',
  styleUrls: ['./senhas.component.css']
})
export class SenhasComponent implements OnInit {
  public idmovemais = 0;
  public update = false;
  senhas: Array<any>;
  public vUsuario: Usuario = new Usuario();



  constructor(public router: Router,
              private verificasenhaService: VerificasenhaService,
              private movemaisService: MovemaisService,
              public autenticacaoService: AutenticacaoService) { }

  ngOnInit() {

    this.idmovemais = this.autenticacaoService.getIdMovemais();
    if (this.idmovemais === 0) {this.router.navigate(['/']) }

    this.Listar();

  }

  click_home() {
       this.router.navigate(['/login']);
  }

  Listar() {
    this.verificasenhaService.getSenhaAll().subscribe(dados => this.senhas = dados);
  }

  click_tabelas() {
      this.router.navigate(['/tabelas']);
  }

click_salvar() {
  const JsonSenha = {
                      documento: this.vUsuario.documento,
                      senha: this.vUsuario.senha,
                      nome: this.vUsuario.nome,
                      idmovemais: this.vUsuario.idmovemais,
                      tipoOSA: this.vUsuario.tipoOSA,
                      engate: this.vUsuario.engate
        }

    if ( this.update === false ) {
         this.movemaisService.postUsuario(JsonSenha).subscribe(resposta => {});
      } else {
         this.movemaisService.updateUsuario(JsonSenha).subscribe(resposta => {});
       }

    this.click_cancelar();
}

click_cancelar() {
    this.vUsuario = new Usuario();
    this.update = false;
    setTimeout( () => { this.Listar(); }, 500);
}

 click_excluir(vdocumento: string) {
    if (confirm('excluir Ususario : ' + vdocumento)) {
            this.movemaisService.deleteUsuario(vdocumento).subscribe(resposta => {});
            this.click_cancelar();
      }
  }

  click_alterar(edUsuario: Usuario){
    this.update = true;
    this.vUsuario = edUsuario;
  }



}


