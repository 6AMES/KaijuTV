import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isTypeDropdownOpen = false;
  isStatusDropdownOpen = false;
  isRatingDropdownOpen = false;
  isGenresDropdownOpen = false;

  // Nuevas propiedades para mobile
  isMobile = false;
  isMobileMenuOpen = false;

  types = [
    { value: 'tv', label: 'TV' },
    { value: 'movie', label: 'Película' },
    { value: 'ova', label: 'OVA' },
    { value: 'special', label: 'Especial' },
  ];

  statuses = [
    { value: 'airing', label: 'En emisión' },
    { value: 'complete', label: 'Completado' },
    { value: 'upcoming', label: 'Próximamente' },
  ];

  ratings = [
    { value: 'g', label: 'G' },
    { value: 'pg', label: 'PG' },
    { value: 'pg13', label: 'PG-13' },
    { value: 'r17', label: 'R-17+' },
    { value: 'r', label: 'R' },
  ];

  genres = [
    { value: '1', label: 'Acción' },
    { value: '2', label: 'Aventura' },
    { value: '4', label: 'Comedia' },
    { value: '8', label: 'Drama' },
    { value: '10', label: 'Fantasía' },
    { value: '22', label: 'Romance' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkScreenWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenWidth();
  }

  private checkScreenWidth(): void {
    this.isMobile = window.innerWidth < 1200;
    if (!this.isMobile) {
      // Cerramos el menú móvil si cambiamos a desktop
      this.isMobileMenuOpen = false;
    }
  }

  toggleDropdown(dropdown: string): void {
    let isOpen = false;

    switch (dropdown) {
      case 'type':
        isOpen = this.isTypeDropdownOpen;
        break;
      case 'status':
        isOpen = this.isStatusDropdownOpen;
        break;
      case 'rating':
        isOpen = this.isRatingDropdownOpen;
        break;
      case 'genres':
        isOpen = this.isGenresDropdownOpen;
        break;
    }

    if (isOpen) {
      this.closeAllDropdowns();
      return;
    }

    this.closeAllDropdowns();

    switch (dropdown) {
      case 'type':
        this.isTypeDropdownOpen = true;
        break;
      case 'status':
        this.isStatusDropdownOpen = true;
        break;
      case 'rating':
        this.isRatingDropdownOpen = true;
        break;
      case 'genres':
        this.isGenresDropdownOpen = true;
        break;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  selectFilter(filter: string, value: string): void {
    this.closeAllDropdowns(); // Cierra todos los desplegables
    this.isMobileMenuOpen = false; // Cierra el menú móvil si está abierto
    this.router.navigate(['/search'], { queryParams: { [filter]: value } });
  }

  private closeAllDropdowns(): void {
    this.isTypeDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.isRatingDropdownOpen = false;
    this.isGenresDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.custom-dropdown') &&
      !target.closest('.dropdown-selected') &&
      !target.closest('.mobile-menu')
    ) {
      this.closeAllDropdowns();
      this.isMobileMenuOpen = false;
    }
  }
}
