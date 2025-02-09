import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AnimeFLVEpisodeResponse } from '../models/animeflv/episode.model';

@Injectable({
  providedIn: 'root',
})
export class AnimeFLVService {
  private apiUrl = 'https://animeflv.ahmedrangel.com/api';
  private slugs: string[] = [];

  constructor(private http: HttpClient) {}

  // Obtener detalles de un episodio específico
  getEpisode(slug: string, number: number): Observable<AnimeFLVEpisodeResponse> {
    return this.http
      .get<AnimeFLVEpisodeResponse>(`${this.apiUrl}/anime/${slug}/episode/${number}`)
      .pipe(catchError(this.handleError));
  }

  // Cargar la lista de slugs desde animes.txt
  loadSlugs(): Observable<string[]> {
    return this.http.get('assets/animes.txt', { responseType: 'text' }).pipe(
      catchError(this.handleError),
      map((data) => {
        // Convertir el contenido del archivo en un array de slugs
        this.slugs = JSON.parse(data);
        return this.slugs;
      })
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error.message);
    return throwError(
      () => new Error('Algo salió mal. Por favor, inténtalo de nuevo más tarde.')
    );
  }
}