import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { JikanAnime } from '../models/jikan/anime.model';

@Injectable({
  providedIn: 'root',
})
export class JikanService {
  private apiUrl = 'https://api.jikan.moe/v4';

  constructor(private http: HttpClient) {}

  // Buscar animes por nombre
  searchAnime(query: string): Observable<{ data: JikanAnime[] }> {
    return this.http
      .get<{ data: JikanAnime[] }>(`${this.apiUrl}/anime?q=${query}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener detalles de un anime por su ID
  getAnimeById(id: number): Observable<{ data: JikanAnime }> {
    return this.http
      .get<{ data: JikanAnime }>(`${this.apiUrl}/anime/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener animes populares
  getTopAnime(): Observable<{ data: JikanAnime[] }> {
    return this.http
      .get<{ data: JikanAnime[] }>(`${this.apiUrl}/top/anime`)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error.message);
    return throwError(
      () => new Error('Algo salió mal. Por favor, inténtalo de nuevo más tarde.')
    );
  }
}