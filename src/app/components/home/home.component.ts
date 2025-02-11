import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JikanAnime } from '../../models/jikan/anime.model';
import { JikanService } from '../../services/jikan.service';
import { FormsModule } from '@angular/forms';
import { style } from '@angular/animations';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild('seasonNowAnimeList') seasonNowAnimeList!: ElementRef;
  @ViewChild('popularAnimeList') popularAnimeList!: ElementRef;
  @ViewChild('upcomingAnimeList') upcomingAnimeList!: ElementRef;
  popularAnimes: JikanAnime[] = [];
  seasonsNow: JikanAnime[] = [];
  seasonsUpcoming: JikanAnime[] = [];
  currentSeason: JikanAnime[] = [];
  currentYear: number = new Date().getFullYear();
  selectedSeason: string = '';
  selectedYear: number = new Date().getFullYear();
  showAll: boolean = false;
  animeTransforms: { [key: number]: any } = {};
  isSeasonDropdownOpen: boolean = false;
  isYearDropdownOpen: boolean = false;
  seasons = [
    { value: 'winter', label: 'Invierno' },
    { value: 'spring', label: 'Primavera' },
    { value: 'summer', label: 'Verano' },
    { value: 'fall', label: 'Otoño' }
  ];
  availableYears: number[] = [];

  showLeftButtonSeasonNow: boolean = false;
  showRightButtonSeasonNow: boolean = true;

  showLeftButtonPopular: boolean = false;
  showRightButtonPopular: boolean = true;

  showLeftButtonUpcoming: boolean = false;
  showRightButtonUpcoming: boolean = true;

  constructor(private jikanService: JikanService, private elementRef: ElementRef) {}

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
    this.generateAvailableYears();
  }

  scrollList(direction: number, listType: string): void {
    const scrollAmount = 1325; // Cantidad de píxeles a desplazar
    let list: HTMLElement;

    switch (listType) {
      case 'seasonNow':
        list = this.seasonNowAnimeList.nativeElement;
        break;
      case 'popular':
        list = this.popularAnimeList.nativeElement;
        break;
      case 'upcoming':
        list = this.upcomingAnimeList.nativeElement;
        break;
      default:
        return;
    }

    // Desplazar horizontalmente
    list.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });

    // Actualizar visibilidad de los botones
    this.checkScroll(listType);
  }

  checkScroll(listType: string): void {
    let list: HTMLElement;

    switch (listType) {
      case 'seasonNow':
        list = this.seasonNowAnimeList.nativeElement;
        this.showLeftButtonSeasonNow = list.scrollLeft > 0;
        this.showRightButtonSeasonNow = list.scrollLeft + list.clientWidth < list.scrollWidth;
        break;
      case 'popular':
        list = this.popularAnimeList.nativeElement;
        this.showLeftButtonPopular = list.scrollLeft > 0;
        this.showRightButtonPopular = list.scrollLeft + list.clientWidth < list.scrollWidth;
        break;
      case 'upcoming':
        list = this.upcomingAnimeList.nativeElement;
        this.showLeftButtonUpcoming = list.scrollLeft > 0;
        this.showRightButtonUpcoming = list.scrollLeft + list.clientWidth < list.scrollWidth;
        break;
    }
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

  getAnimeStatus(status: string): string {
    const animeStatus: { [key: string]: string } = {
      "Currently Airing": 'En emisión',
      "Not yet aired": 'No emitido',
      "Finished Airing": 'Terminado',
    };
  
    return animeStatus[status] || status;
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

  validateYear() {
    if (this.selectedYear < 1917) {
      this.selectedYear = 1917;
    } else if (this.selectedYear > this.currentYear) {
      this.selectedYear = this.currentYear;
    }
    this.fetchSeasonalAnime();
  }

  generateAvailableYears() {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    for (let i = 0; i < 50; i++) {
      this.availableYears.push(currentYear - i);
    }
  }

  preventManualEdit(event: KeyboardEvent) {
    event.preventDefault();
  }

  toggleSeasonDropdown() {
    this.isSeasonDropdownOpen = !this.isSeasonDropdownOpen;
  }

  toggleYearDropdown() {
    this.isYearDropdownOpen = !this.isYearDropdownOpen;
  }

  selectSeason(season: string) {
    this.selectedSeason = season;
    this.isSeasonDropdownOpen = false;
    this.fetchSeasonalAnime();
  }

  selectYear(year: number) {
    this.selectedYear = year;
    this.isYearDropdownOpen = false;
    this.fetchSeasonalAnime();
  }

  getAnimeStatusClass(status: string): string {
    const statusColors: { [key: string]: string } = {
      "Currently Airing": 'status-airing',
      "Not yet aired": 'status-not-aired',
      "Finished Airing": 'status-finished',
    };
  
    return statusColors[status] || 'status-default';
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const seasonDropdown = this.elementRef.nativeElement.querySelector('.custom-dropdown');
    const yearDropdown = this.elementRef.nativeElement.querySelector('.custom-dropdown.year');

    // Verificar si el clic ocurrió fuera del desplegable de temporada
    if (
      this.isSeasonDropdownOpen &&
      !this.elementRef.nativeElement.querySelector('.dropdown-selected').contains(event.target) &&
      !this.elementRef.nativeElement.querySelector('.dropdown-options')?.contains(event.target)
    ) {
      this.isSeasonDropdownOpen = false;
    }

    // Verificar si el clic ocurrió fuera del desplegable de año
    if (
      this.isYearDropdownOpen &&
      !this.elementRef.nativeElement.querySelector('.dropdown-selected.year').contains(event.target) &&
      !this.elementRef.nativeElement.querySelector('.dropdown-list')?.contains(event.target)
    ) {
      this.isYearDropdownOpen = false;
    }
  }
}
