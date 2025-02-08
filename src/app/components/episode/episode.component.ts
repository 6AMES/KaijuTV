import { Component } from '@angular/core';
import { JikanEpisodeDetail } from '../../models/jikan/episode-detail.model';
import { ActivatedRoute } from '@angular/router';
import { JikanService } from '../../services/jikan.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-episode',
  imports: [CommonModule],
  templateUrl: './episode.component.html',
  styleUrl: './episode.component.css'
})
export class EpisodeComponent {
  episode: JikanEpisodeDetail | null = null; // Detalles del episodio

  constructor(
    private route: ActivatedRoute, // Para obtener los parámetros de la ruta
    private jikanService: JikanService // Servicio de Jikan
  ) {}

  ngOnInit(): void {
    // Obtener el animeId y el episodeNumber de la ruta
    const animeId = this.route.snapshot.paramMap.get('animeId');
    const episodeNumber = this.route.snapshot.paramMap.get('episodeNumber');

    if (animeId && episodeNumber) {
      // Obtener los detalles del episodio
      this.jikanService.getEpisodeDetail(+animeId, +episodeNumber).subscribe(
        (response) => {
          this.episode = response.data; // Asignar los detalles del episodio
        },
        (error) => {
          console.error('Error al obtener los detalles del episodio:', error); // Manejar errores
        }
      );
    }
  }
}
