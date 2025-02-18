import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JikanService } from '../../services/jikan.service';
import { JikanAnime } from '../../models/jikan/anime.model';
import { JikanEpisode, JikanEpisodeResponse } from '../../models/jikan/episode.model';
import { CommonModule } from '@angular/common';
import { EpisodeListComponent } from "../episode-list/episode-list.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Importa DomSanitizer

@Component({
  selector: 'app-anime-detail',
  standalone: true,
  imports: [CommonModule, EpisodeListComponent],
  templateUrl: './anime-detail.component.html',
  styleUrls: ['./anime-detail.component.css'],
})
export class AnimeDetailComponent implements OnInit {
  anime: JikanAnime | null = null; // Información del anime
  episodesResponse: JikanEpisodeResponse | null = null; // Respuesta de episodios con paginación
  episodes: JikanEpisode[] = [];
  videoUrl: SafeResourceUrl | null = null; // Variable para la URL del tráiler

  constructor(
    private route: ActivatedRoute, // Para obtener el parámetro de la ruta
    private jikanService: JikanService, // Servicio de Jikan
    private sanitizer: DomSanitizer // Para sanitizar la URL del tráiler
  ) {}

  ngOnInit(): void {
    // Obtener el ID del anime de la ruta
    const animeId = this.route.snapshot.paramMap.get('id');
    console.log('ID de Anime:', animeId);
  
    if (animeId) {
      // Obtener detalles del anime
      this.jikanService.getAnimeById(+animeId).subscribe((response) => {
        console.log('Respuesta de detalles del anime:', response);
        this.anime = response.data;

        // Obtener la URL del tráiler si existe
        if (this.anime?.trailer?.embed_url) {
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.anime.trailer.embed_url);
        }

        // Obtener la lista de episodios
        this.jikanService.getAnimeEpisodes(+animeId).subscribe(
          (response) => {
            console.log('Respuesta de episodios:', response);
            this.episodesResponse = response;
            this.episodes = response.data;
          },
          (error) => {
            console.error('Error al obtener los episodios:', error);
          }
        );
      });
    } else {
      console.error('No se encontró el ID del anime');
    }
  } 

  getGenres(anime: JikanAnime): string {
    if (!anime || !anime.genres || anime.genres.length === 0) {
      return 'No disponible';
    }
    return anime.genres.map(genre => genre.name).join(', ');
  }

  getSimpleRating(rating: string): string {
    const ratingSimple: { [key: string]: string } = {
      "G - All Ages": 'G',
      "PG - Children": 'PG',
      "PG-13 - Teens 13 or older": 'PG-13',
      "R - 17+ (violence & profanity)": 'R-17+',
      "R+ - Mild Nudity": 'R+',
      "Rx - Hentai": 'Rx',
    };
  
    return ratingSimple[rating] || rating;
  }
}
