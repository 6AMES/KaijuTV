import { Component, Input } from '@angular/core';
import { JikanEpisode } from '../../models/jikan/episode.model';
import { CommonModule } from '@angular/common';
import { JikanAnime } from '../../models/jikan/anime.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './episode-list.component.html',
  styleUrls: ['./episode-list.component.css'],
})
export class EpisodeListComponent {
  @Input() episodes: JikanEpisode[] = [];
  @Input() anime: JikanAnime | null = null;
  animeTransforms: { [key: number]: any } = {};

  isFillerOrRecap(episode: JikanEpisode): string {
    if (episode.filler) return 'Filler';
    if (episode.recap) return 'Recap';
    return '';
  }

  handleMouseMove(event: MouseEvent, animeId: number) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    this.animeTransforms[animeId] = {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      transition: 'transform 0.1s ease-out',
    };
  }

  resetTransform(animeId: number) {
    this.animeTransforms[animeId] = {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.3s ease-out',
    };
  }
}