import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getItems() {
    return this.http.get<any[]>(`${this.baseUrl}/items`);
  }

  createItem(name: string){
    return this.http.post(`${this.baseUrl}/items`, { name }); 
  }
}
