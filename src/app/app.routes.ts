import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AnimeDetailComponent } from './components/anime-detail/anime-detail.component';
import { EpisodeComponent } from './components/episode/episode.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'anime/:id', component: AnimeDetailComponent },
    { path: 'anime/:animeId/episode/:episodeNumber', component: EpisodeComponent },
    { path: '**', redirectTo: '' },
];
