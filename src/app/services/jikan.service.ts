import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, mergeMap, of, retryWhen, take, throwError, timer } from 'rxjs';
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

    console.log("Llamando a la API con URL:", url);

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

    console.log("Llamando a la API con URL:", url);

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

    console.log("Llamando a la API con URL:", url);

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

  // Obtener los animes por temporada específica
  getCurrentSeason(): Observable<any> {
    const { year, season } = this.getRealSeason();
    const url = `${this.apiUrl}/seasons/${year}/${season}`;

    console.log("Llamando a la API con URL:", url);

    return this.http.get<any>(url).pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error) => {
            if (error.status === 429) {
              return timer(500);
            }
            return throwError(() => error);
          })
        )
      )
    );
  }


  public getRealSeason(): { year: number; season: string; seasonName: string } {
    const now = new Date();
    const month = now.getMonth() + 1; // Mes actual (1-12)
    const year = now.getFullYear();
    let season = '';
    let seasonName = '';

    // Ajustar la estación según el mes (Hemisferio Norte)
    if (month >= 12 || month <= 2) {
      season = 'winter';
      seasonName = 'invierno';
    } else if (month >= 3 && month <= 5) {
      season = 'spring';
      seasonName = 'primavera';
    } else if (month >= 6 && month <= 8) {
      season = 'summer';
      seasonName = 'verano';
    } else {
      season = 'fall';
      seasonName = 'otoño';
    }

    return { year, season, seasonName };
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