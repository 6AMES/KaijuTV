import { Component, OnInit } from '@angular/core';
import { JikanAnime } from '../../models/jikan/anime.model';
import { ActivatedRoute } from '@angular/router';
import { JikanService } from '../../services/jikan.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchResults: JikanAnime[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private jikanService: JikanService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const query = params['q'] || '';
      const type = params['type'];
      const status = params['status'];
      const rating = params['rating'];
      const genres = params['genres'];

      this.searchAnimes(query, type, status, rating, genres);
    });
  }

  searchAnimes(
    query: string,
    type?: string,
    status?: string,
    rating?: string,
    genres?: string
  ): void {
    this.loading = true;
    this.jikanService
      .getAnimeSearch(query, 1, type, status, rating, genres)
      .subscribe({
        next: (response) => {
          this.searchResults = response.data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
  }
}