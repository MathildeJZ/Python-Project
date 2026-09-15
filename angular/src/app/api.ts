import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/items`);
  }

  createItem(name: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/items`, { name });
  }

  deleteItem(id: number) {
    return this.http.delete(`${this.baseUrl}/items/${id}`);
  }

}
