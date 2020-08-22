import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { timeout } from 'rxjs/operators';
var Ttimeout = 2000;


@Injectable({
  providedIn: 'root'
})
export class VerificasenhaService {
  constructor(private http: HttpClient) {}


  getSenha(doc: any): Observable<any> {
    return this.http.post(environment.servAPI + '/vsenha/' , {'documento': doc }).pipe( timeout(Ttimeout));
  }

  getSenhaAll(): Observable<any> {
    return this.http.post(environment.servAPI + '/vsenhas/', {});
  }


}
