/* eslint-disable prefer-const */
/* eslint-disable object-shorthand */
/* eslint-disable no-trailing-spaces */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { GLOBAL } from './global';

@Injectable({
    providedIn: 'root'
  })
  export class NodeService {

    public url: string;
  
    constructor(private http: HttpClient,
                private router: Router) 
                {
                  this.url = GLOBAL.url;
                }
  

    sendPresupuesto(presupuesto) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      let headers = new HttpHeaders({'Content-Type': 'application/json' });
      return this.http.post<any>(this.url + '/api/v1/presupuestos/createpdf', presupuesto, {headers: headers});
    }

    getPresupuestosPDF() {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      let headers = new HttpHeaders({'Content-Type': 'application/json' });
      return this.http.get<any>(this.url + '/api/v1/presupuestos/docs', {headers: headers});
    }

}



