import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JikanAnime } from '../../models/jikan/anime.model';
import { JikanService } from '../../services/jikan.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  popularAnimes: JikanAnime[] = [];
  seasonsNow: JikanAnime[] = [];
  seasonsUpcoming: JikanAnime[] = [];
  currentSeason: JikanAnime[] = [];
  selectedSeason: string = '';
  selectedYear: number = new Date().getFullYear();
  showAll: boolean = false;
  animeTransforms: { [key: number]: any } = {};

  constructor(private jikanService: JikanService) {}

  ngOnInit(): void {
    this.jikanService.getTopAnime().subscribe((Response) => {
      this.popularAnimes = Response.data;
    });

    this.jikanService.getSeasonNow().subscribe((Response) => {
      this.seasonsNow = Response.data;
    });
    
    this.jikanService.getSeasonUpcoming().subscribe((Response) => {
      this.seasonsUpcoming = Response.data;
    });

    this.selectedSeason = this.getCurrentSeason();
    this.fetchSeasonalAnime();
  }

  fetchSeasonalAnime() {
    if (!this.selectedSeason || !this.selectedYear) return;

    this.jikanService.getSeasonAnime(this.selectedYear, this.selectedSeason).subscribe({
      next: (response) => {
        this.currentSeason = response.data;
      },
    });
  }

  getSeasonInSpanish(season: string): string {
    const seasonTranslations: { [key: string]: string } = {
      winter: 'Invierno',
      spring: 'Primavera',
      summer: 'Verano',
      fall: 'Otoño'
    };
  
    return seasonTranslations[season] || season;
  }

  getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;

    if (month >= 12 || month <= 2) return 'winter';
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    return 'fall';
  }

  getSimpleRating(rating: string): string {
    const ratingSimple: { [key: string]: string } = {
      "R - 17+ (violence & profanity)": 'R-17+',
      "R+ - Mild Nudity": 'R+',
      "PG-13 - Teens 13 or older": 'PG-13',
    };
  
    return ratingSimple[rating] || rating;
  }

  getGenres(anime: JikanAnime): string {
    return anime.genres.map(genre => genre.name).join(', ');
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  handleMouseMove(event: MouseEvent, animeId: number) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left; // Posición del mouse dentro de la card
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Rotación en X (invertida)
    const rotateY = ((x - centerX) / centerX) * 10; // Rotación en Y

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
