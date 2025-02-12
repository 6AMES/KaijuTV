import { Component, OnInit } from '@angular/core';
import { JikanAnime } from '../../models/jikan/anime.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JikanService } from '../../services/jikan.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [CommonModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchResults: JikanAnime[] = [];
  loading = false;
  currentPage = 1;
  animeTransforms: { [key: number]: any } = {};
  pageTitle: string = 'Todos los animes';

  constructor(
    private route: ActivatedRoute,
    private jikanService: JikanService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const query = params['q'] || '';
      const type = params['type'];
      const status = params['status'];
      const rating = params['rating'];
      const genres = params['genres'];

      this.searchAnimes(query, type, status, rating, genres);

      if (query) {
        this.pageTitle = `Resultados para "${query}"`;
      } else if (rating) {
        this.pageTitle = `Clasificación: ${this.getSimpleRating(rating)}`;
      } else if (type) {
        this.pageTitle = `Tipo: ${this.getTypeLabel(type)}`;
      } else if (status) {
        this.pageTitle = `Estado: ${this.getStatusLabel(status)}`;
      } else if (genres) {
        this.pageTitle = `Género: ${this.getAnimeGenre(genres)}`;
      } else {
        this.pageTitle = 'Todos los animes';
      }
    });
  }

  getTypeLabel(type: string): string {
    const typeLabels: { [key: string]: string } = {
      tv: 'TV',
      movie: 'Película',
      ova: 'OVA',
      special: 'Especial',
    };
    return typeLabels[type] || type;
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      airing: 'En emisión',
      complete: 'Completado',
      upcoming: 'Próximamente',
    };
    return statusLabels[status] || status;
  }

  searchAnimes(
    query: string,
    type?: string,
    status?: string,
    rating?: string,
    genres?: string,
    appendResults: boolean = false
  ): void {
    this.loading = true;

    this.jikanService.getAnimeSearch(query, this.currentPage, type, status, rating, genres).subscribe({
      next: (response) => {
        if (appendResults) {
          this.searchResults = [...this.searchResults, ...response.data];
        } else {
          this.searchResults = response.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  loadMoreAnimes(): void {
    this.currentPage++;
    const query = this.route.snapshot.queryParams['q'] || '';
    const type = this.route.snapshot.queryParams['type'];
    const status = this.route.snapshot.queryParams['status'];
    const rating = this.route.snapshot.queryParams['rating'];
    const genres = this.route.snapshot.queryParams['genres'];

    this.searchAnimes(query, type, status, rating, genres, true);
  }

  getAnimeGenre(genre: string): string {
    const animeGenre: { [key: string]: string } = {
      1: 'Acción',
      2: 'Aventura',
      4: 'Comedia',
      8: 'Drama',
      10: 'Fantasía',
      22: 'Romance',
    };

    return animeGenre[genre] || genre;
  }

  getAnimeStatus(status: string): string {
    const animeStatus: { [key: string]: string } = {
      "Currently Airing": 'En emisión',
      "Not yet aired": 'No emitido',
      "Finished Airing": 'Terminado',
    };

    return animeStatus[status] || status;
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