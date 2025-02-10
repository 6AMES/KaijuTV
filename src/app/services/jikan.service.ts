import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
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
    return this.http
      .get<{ data: JikanAnime[] }>(`${this.apiUrl}/top/anime`)
      .pipe(catchError(this.handleError));
  }

  // Obtener los animes de la temporada actual
  getSeasonsNow(): Observable<{ data: JikanAnime[] }> {
    return this.http
      .get<{ data: JikanAnime[] }>(`${this.apiUrl}/seasons/now`)
      .pipe(catchError(this.handleError));
  }

  // Obtener los animes de la siguiente temporada
  getSeasonsUpcoming(): Observable<{ data: JikanAnime[] }> {
    return this.http
      .get<{ data: JikanAnime[] }>(`${this.apiUrl}/seasons/upcoming`)
      .pipe(catchError(this.handleError));
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

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error.message);
    return throwError(
      () => new Error('Algo salió mal. Por favor, inténtalo de nuevo más tarde.')
    );
  }
}