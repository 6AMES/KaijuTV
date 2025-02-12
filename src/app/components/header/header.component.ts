import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // Estados para controlar los desplegables
  isTypeDropdownOpen = false;
  isStatusDropdownOpen = false;
  isRatingDropdownOpen = false;
  isGenresDropdownOpen = false;

  // Opciones para cada filtro
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
    { value: 'rx', label: 'RX' },
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

  // Métodos para alternar los desplegables
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

  // Método para manejar la selección de una opción
  selectFilter(filter: string, value: string): void {
    this.closeAllDropdowns(); // Cierra todos los desplegables
    this.router.navigate(['/search'], { queryParams: { [filter]: value } });
  }

  // Cierra todos los desplegables
  private closeAllDropdowns(): void {
    this.isTypeDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.isRatingDropdownOpen = false;
    this.isGenresDropdownOpen = false;
  }

  // Detecta clics fuera del desplegable
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (
      !target.closest('.custom-dropdown') &&
      !target.closest('.dropdown-selected')
    ) {
      this.closeAllDropdowns();
    }
  }
}