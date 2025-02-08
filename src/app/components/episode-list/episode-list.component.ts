import { Component, Input } from '@angular/core';
import { JikanEpisode } from '../../models/jikan/episode.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-episode-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './episode-list.component.html',
  styleUrls: ['./episode-list.component.scss'],
})
export class EpisodeListComponent {
  @Input() episodes: JikanEpisode[] = []; // Recibir la lista de episodios desde el padre
  @Input() animeId: number = 0;
}