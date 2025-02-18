import { Component } from '@angular/core';
import { JikanEpisodeDetail } from '../../models/jikan/episode-detail.model';
import { ActivatedRoute } from '@angular/router';
import { JikanService } from '../../services/jikan.service';
import { CommonModule } from '@angular/common';
import { AnimeFLVEpisodeResponse } from '../../models/animeflv/episode.model';
import { AnimeFLVService } from '../../services/animeflv.service';
import { VideoPlayerComponent } from "../video-player/video-player.component";
import { JikanAnime } from '../../models/jikan/anime.model';
import { RemoveSourcePipe } from '../../pipes/remove-source.pipe';

@Component({
  selector: 'app-episode-detail',
  imports: [CommonModule, VideoPlayerComponent, RemoveSourcePipe],
  templateUrl: './episode-detail.component.html',
  styleUrl: './episode-detail.component.css'
})
export class EpisodeDetailComponent {
  anime: JikanAnime | null = null;
  episode: JikanEpisodeDetail | null = null; // Detalles del episodio desde Jikan
  animeFLVEpisode: AnimeFLVEpisodeResponse | null = null; // Detalles del episodio desde AnimeFL
  videoUrl: string | null = null; // URL del video de Mega

  constructor(
    private route: ActivatedRoute, // Para obtener los parámetros de la ruta
    private jikanService: JikanService, // Servicio de Jikan
    private animeFLVService: AnimeFLVService // Servicio de AnimeFLV
  ) {}

  ngOnInit(): void {
    const animeId = this.route.snapshot.paramMap.get('animeId');
    const episodeNumber = this.route.snapshot.paramMap.get('episodeNumber');

    if (animeId && episodeNumber) {
      // Obtener detalles del anime
      this.jikanService.getAnimeById(+animeId).subscribe(
        (animeResponse) => {
          console.log('Respuesta completa de Jikan:', animeResponse);
          this.anime = animeResponse.data;

          console.log('title_english:', this.anime?.title_english);
          console.log('title:', this.anime?.title);

          // Obtener detalles del episodio
          this.jikanService.getEpisodeDetail(+animeId, +episodeNumber).subscribe(
            (response) => {
              this.episode = response.data;
              if (this.anime) {
                this.fetchEpisodeFromAnimeFLV(this.anime.title_english, this.anime.title, +episodeNumber);
              }
            },
            (error) => {
              console.error('Error al obtener los detalles del episodio desde Jikan:', error);
            }
          );
        },
        (error) => {
          console.error('Error al obtener los detalles del anime:', error);
        }
      );
    }
  }

  fetchEpisodeFromAnimeFLV(titleEnglish: string | undefined, title: string | undefined, episodeNumber: number): void {
    const slugEnglish = titleEnglish ? this.normalizeTitle(titleEnglish) : null;
    const slugTitle = title ? this.normalizeTitle(title) : null;

    if (slugEnglish) {
      console.log('Intentando con slug inglés:', slugEnglish);
      this.animeFLVService.getEpisode(slugEnglish, episodeNumber).subscribe(
        (response) => {
          this.handleAnimeFLVResponse(response);
        },
        (error) => {
          console.warn(`Error con slug inglés (${slugEnglish}):`, error);
          if (slugTitle) {
            console.log('Intentando con slug title:', slugTitle);
            this.animeFLVService.getEpisode(slugTitle, episodeNumber).subscribe(
              (response) => {
                this.handleAnimeFLVResponse(response);
              },
              (finalError) => {
                console.error(`Error con slug title (${slugTitle}):`, finalError);
              }
            );
          }
        }
      );
    } else if (slugTitle) {
      console.log('Intentando solo con slug title:', slugTitle);
      this.animeFLVService.getEpisode(slugTitle, episodeNumber).subscribe(
        (response) => {
          this.handleAnimeFLVResponse(response);
        },
        (error) => {
          console.error(`Error con slug title (${slugTitle}):`, error);
        }
      );
    }
  }

  handleAnimeFLVResponse(response: AnimeFLVEpisodeResponse): void {
    this.animeFLVEpisode = response;
    const megaServer = this.animeFLVEpisode.data.servers.find(server => server.name === 'MEGA');
    if (megaServer) {
      this.videoUrl = megaServer.embed;
    }
  }

  normalizeTitle(title: string): string {
    return title
      .toLowerCase() // Convertir a minúsculas
      .replace(/[°]/g, ' ') // Reemplazar ° con un espacio
      .replace(/[^a-z0-9 ]+/g, '-') // Reemplazar otros caracteres no alfanuméricos con guiones
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y al final
  }
}
