import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, mergeMap, retryWhen, throwError, timer } from 'rxjs';
import { JikanAnime } from '../models/jikan/anime.model';
import { JikanEpisode, JikanEpisodeResponse } from '../models/jikan/episode.model';
import { JikanEpisodeDetail } from '../models/jikan/episode-detail.model';

@Injectable({
  providedIn: 'root',
})
export class JikanService {
  private apiUrl = 'https://api.jikan.moe/v4';

  constructor(private http: HttpClient) {}

  // Obtener los animes más populares (top animes)
  getTopAnime(): Observable<{ data: JikanAnime[] }> {
    const url = `${this.apiUrl}/top/anime`;

    return this.http.get<{ data: JikanAnime[] }>(url).pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error) => {
            if (error.status === 429) {
              return timer(500);
            }
            return throwError(() => error);
          })
        )
      ),
    );
  }

  // Obtener los animes de la temporada actual
  getSeasonNow(): Observable<{ data: JikanAnime[] }> {
    const url = `${this.apiUrl}/seasons/now`;

    return this.http.get<{ data: JikanAnime[] }>(url).pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error) => {
            if (error.status === 429) {
              return timer(500);
            }
            return throwError(() => error);
          })
        )
      ),
    );
  }

  // Obtener los animes de la siguiente temporada
  getSeasonUpcoming(): Observable<{ data: JikanAnime[] }> {
    const url = `${this.apiUrl}/seasons/upcoming`;

    return this.http.get<{ data: JikanAnime[] }>(url).pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error) => {
            if (error.status === 429) {
              return timer(500);
            }
            return throwError(() => error);
          })
        )
      ),
    );
  }

  // Obtener animes por la temporada elegida
  getSeasonAnime(year: number, season: string): Observable<any> {
    const url = `${this.apiUrl}/seasons/${year}/${season}`;

    return this.http.get<{ data: JikanAnime[] }>(url).pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error) => {
            if (error.status === 429) {
              return timer(500);
            }
            return throwError(() => error);
          })
        )
      ),
    );
  }

  // Obtener detalles completos de un anime por su ID
  getAnimeFullById(id: number): Observable<{ data: JikanAnime }> {
    return this.http
      .get<{ data: JikanAnime }>(`${this.apiUrl}/anime/${id}/full`)
      .pipe(catchError(this.handleError));
  }

  // Obtener detalles básicos de un anime por su ID
  getAnimeById(id: number): Observable<{ data: JikanAnime }> {
    return this.http
      .get<{ data: JikanAnime }>(`${this.apiUrl}/anime/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener la lista de episodios de un anime por su ID
  getAnimeEpisodes(id: number, page: number = 1): Observable<JikanEpisodeResponse> {
    return this.http
      .get<JikanEpisodeResponse>(`${this.apiUrl}/anime/${id}/episodes?page=${page}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener un episodio específico de un anime por su ID y número de episodio
  getAnimeEpisodeById(id: number, episodeNumber: number): Observable<{ data: JikanEpisode }> {
    return this.http
      .get<{ data: JikanEpisode }>(`${this.apiUrl}/anime/${id}/episodes/${episodeNumber}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener detalles de un episodio específico
  getEpisodeDetail(animeId: number, episodeNumber: number): Observable<{ data: JikanEpisodeDetail }> {
    return this.http
      .get<{ data: JikanEpisodeDetail }>(`${this.apiUrl}/anime/${animeId}/episodes/${episodeNumber}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener animes por búsqueda
  getAnimeSearch(
    query: string,
    page: number = 1,
    type?: string,
    status?: string,
    rating?: string,
    genres?: string,
    orderBy?: string,
    sort?: string
  ): Observable<{ data: JikanAnime[] }> {
    const url = `${this.apiUrl}/anime`;
    const params = new URLSearchParams();

    // Añadir parámetros obligatorios
    params.set('q', query);
    params.set('page', page.toString());

    // Añadir parámetros opcionales si están presentes
    if (type) params.set('type', type);
    if (status) params.set('status', status);
    if (rating) params.set('rating', rating);
    if (genres) params.set('genres', genres);
    if (orderBy) params.set('order_by', orderBy);
    if (sort) params.set('sort', sort);

    return this.http.get<{ data: JikanAnime[] }>(`${url}?${params.toString()}`).pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error) => {
            if (error.status === 429) {
              return timer(500); // Esperar 500ms en caso de límite de tasa excedido
            }
            return throwError(() => error);
          })
        )
      ),
      catchError(this.handleError)
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