
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Hent huskesedler
  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/items`);
  }
  

  // Opret huskeseddel
  createItem(item: { name: string; category: string }) {
    return this.http.post(`${this.baseUrl}/items`, item);
  }

  // Opdater huskeseddel
  updateItem(id: number, item: { name: string; category: string }) {
    return this.http.put(`${this.baseUrl}/items/${id}`, item);
  }

  // Slet huskeseddel
  deleteItem(id: number) {
    return this.http.delete(`${this.baseUrl}/items/${id}`);
  }

  // Hent alle lister
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }

  // Opret en ny liste
  createCategory(category: { name: string }) {
    return this.http.post(`${this.baseUrl}/categories`, category);
  }

  // Slet en liste
  deleteCategory(id: number) {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }
}
