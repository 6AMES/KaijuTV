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
  isSectionsDropdownOpen = false; // Nuevo estado para el menú de secciones

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
      this.isMobileMenuOpen = false;
    }
  }

  toggleDropdown(dropdown: string): void {
    console.log(`Toggling dropdown: ${dropdown}`);
  
    // Si el dropdown ya estaba abierto, solo lo cerramos
    if (
      (dropdown === 'type' && this.isTypeDropdownOpen) ||
      (dropdown === 'status' && this.isStatusDropdownOpen) ||
      (dropdown === 'rating' && this.isRatingDropdownOpen) ||
      (dropdown === 'genres' && this.isGenresDropdownOpen) ||
      (dropdown === 'sections' && this.isSectionsDropdownOpen)
    ) {
      this.closeAllDropdowns();
      console.log("Cerrando todos los dropdowns");
      return;
    }
  
    // Cierra los otros dropdowns antes de abrir el nuevo
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
      case 'sections':
        this.isSectionsDropdownOpen = true;
        break;
    }
  
    console.log(`Estado actualizado: 
      Type: ${this.isTypeDropdownOpen}, 
      Status: ${this.isStatusDropdownOpen}, 
      Rating: ${this.isRatingDropdownOpen}, 
      Genres: ${this.isGenresDropdownOpen}, 
      Sections: ${this.isSectionsDropdownOpen}`);
  }
  

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log(`Menú móvil abierto: ${this.isMobileMenuOpen}`);
  }

  selectFilter(filter: string, value: string): void {
    this.isMobileMenuOpen = false;
    this.router.navigate(['/search'], { queryParams: { [filter]: value } });
  }

  closeAllDropdowns(): void {
    console.log("Cerrando todos los dropdowns");
    this.isTypeDropdownOpen = false;
    this.isStatusDropdownOpen = false;
    this.isRatingDropdownOpen = false;
    this.isGenresDropdownOpen = false;
    this.isSectionsDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    console.log("Click detectado en:", target);

    // Evitar que se cierre el menú al hacer clic en el botón de hamburguesa
    if (target.closest('.mobile-menu-icon')) {
      console.log("Clic en el icono del menú móvil, no cerrar.");
      return;
    }

    if (
      !target.closest('.custom-dropdown') &&
      !target.closest('.dropdown-selected') &&
      !target.closest('.mobile-menu-options') &&  // <-- Evita cerrar si se hace clic dentro del menú
      !target.closest('.sections-dropdown')
    ) {
      console.log("Clic fuera de menú, cerrando.");
      this.closeAllDropdowns();
      this.isMobileMenuOpen = false;
    }
  }

}