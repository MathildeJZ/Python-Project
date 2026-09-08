    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { Book } from '../services/book';

    @Injectable({
    providedIn: 'root'
    })
    export class BookService {

    private apiUrl = 'http://localhost:5000/api/books';

    constructor(private http: HttpClient) {}

    getAll(): Observable<Book[]> {
        return this.http.get<Book[]>(this.apiUrl);
    }

    get(id: number): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/${id}`);
    }

    add(book: Book): Observable<Book> {
        return this.http.post<Book>(this.apiUrl, book);
    }

    update(book: Book): Observable<Book> {
        return this.http.put<Book>(this.apiUrl, book);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    search(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search?query=${query}`);
    }

    }
