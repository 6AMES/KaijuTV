import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JikanAnime } from '../../models/jikan/anime.model';
import { JikanService } from '../../services/jikan.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  popularAnimes: JikanAnime[] = [];
  seasonsNow: JikanAnime[] = [];
  seasonsUpcoming: JikanAnime[] = [];


  constructor(private jikanService: JikanService) {}

  ngOnInit(): void {
    this.jikanService.getTopAnime().subscribe((Response) => {
      this.popularAnimes = Response.data;
    });

    this.jikanService.getSeasonsNow().subscribe((Response) => {
      this.seasonsNow = Response.data;
    });
    
    this.jikanService.getSeasonsUpcoming().subscribe((Response) => {
      this.seasonsUpcoming = Response.data;
    });
  }

  getGenres(anime: JikanAnime): string {
    return anime.genres.map(genre => genre.name).join(', ');
  }
}
