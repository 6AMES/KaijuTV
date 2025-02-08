// services/animeflv.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AnimeFLVAnime } from '../models/animeflv/anime.model';
import { AnimeFLVEpisode } from '../models/animeflv/episode.model';

@Injectable({
  providedIn: 'root',
})
export class AnimeFLVService {
  private apiUrl = 'https://animeflv.ahmedrangel.com/api/v1';

  constructor(private http: HttpClient) {}

  // Obtener un anime por su slug
  getAnimeBySlug(slug: string): Observable<AnimeFLVAnime> {
    return this.http
      .get<AnimeFLVAnime>(`${this.apiUrl}/anime/${slug}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener un episodio por su slug
  getEpisodeBySlug(slug: string): Observable<AnimeFLVEpisode> {
    return this.http
      .get<AnimeFLVEpisode>(`${this.apiUrl}/anime/episode/${slug}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener un episodio por su slug y número
  getEpisodeBySlugAndNumber(slug: string, number: number): Observable<AnimeFLVEpisode> {
    return this.http
      .get<AnimeFLVEpisode>(`${this.apiUrl}/anime/${slug}/episode/${number}`)
      .pipe(catchError(this.handleError));
  }

  // Buscar animes por consulta
  searchAnime(query: string): Observable<AnimeFLVAnime[]> {
    return this.http
      .get<AnimeFLVAnime[]>(`${this.apiUrl}/search?query=${query}`)
      .pipe(catchError(this.handleError));
  }

  // Buscar animes por filtros (POST)
  searchAnimeByFilters(filters: any): Observable<AnimeFLVAnime[]> {
    return this.http
      .post<AnimeFLVAnime[]>(`${this.apiUrl}/search/by-filter`, filters)
      .pipe(catchError(this.handleError));
  }

  // Buscar animes por URL
  searchAnimeByUrl(url: string): Observable<AnimeFLVAnime> {
    return this.http
      .get<AnimeFLVAnime>(`${this.apiUrl}/search/by-url?url=${url}`)
      .pipe(catchError(this.handleError));
  }

  // Obtener una lista de los últimos episodios lanzados
  getLatestEpisodes(): Observable<AnimeFLVEpisode[]> {
    return this.http
      .get<AnimeFLVEpisode[]>(`${this.apiUrl}/list/latest-episodes`)
      .pipe(catchError(this.handleError));
  }

  // Obtener una lista de animes en emisión
  getAnimesOnAir(): Observable<AnimeFLVAnime[]> {
    return this.http
      .get<AnimeFLVAnime[]>(`${this.apiUrl}/list/animes-on-air`)
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