import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private _http: HttpClient) { }

  getAllTasks(): Observable<any> {
    return this._http.get('https://jsonplaceholder.typicode.com/todos')
  }
}
