import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-beauty-center',
  standalone: true,
  templateUrl: './beauty-center.component.html',
  imports: [CommonModule, RouterLink, FormsModule],
  styleUrls: ['./beauty-center.component.scss']
})
export class BeautyCenterComponent implements OnInit {
  centers = [
    { id: 1, name: 'مركز تجميل 1', imageUrl: 'https://mostaql.hsoubcdn.com/uploads/portfolios/835649/61a1e466eb008/Beauty-Centre-2.jpg', price: 3000, description: 'الوصف', city: 'القاهرة', town: 'القاهرة' },
    { id: 2, name: 'مركز تجميل 2', imageUrl: 'https://mostaql.hsoubcdn.com/uploads/thumbnails/835649/5fb1c7c34bc0a/Beauty-Centre-1.jpg', price: 4000, description: 'الوصف', city: 'الإسكندرية', town: 'الإسكندرية' },
    { id: 3, name: 'مركز تجميل 3', imageUrl: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/bc1bfb70157027.5b99e26e3d2f2.jpg', price: 5000, description: 'الوصف', city: 'الجيزة', town: 'الجيزة' },
    { id: 4, name: 'مركز تجميل 4', imageUrl: 'https://i.pinimg.com/736x/e1/ba/c4/e1bac453a27eb88be3fb05fd64bcf3b6.jpg', price: 2000, description: 'الوصف', city: 'بورسعيد', town: 'بورسعيد' }
  ];

  currentPage: number = 1;
  itemsPerPage: number = 16;
  selectedCity: string = '';
  selectedTown: string = '';
  maxPrice = 5000;
  priceRange: { min: number; max: number } = { min: 1000, max: 5000 };
  favoriteCenters: any[] = [];

  towns: string[] = [
    'القاهرة',
    'الإسكندرية',
    'الجيزة',
    'بورسعيد'
  ];

  cities: string[] = [
    'القاهرة',
    'الإسكندرية',
    'الجيزة',
    'بورسعيد'
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.filterCenters();
  }

  get filteredCenters() {
    return this.centers.filter(center => {
      return (!this.selectedTown || center.town === this.selectedTown)
        && (!this.selectedCity || center.city === this.selectedCity)
        && (center.price <= this.maxPrice);
    });
  }

  filterCenters() {
    this.currentPage = 1;
  }

  addToFavorites(center: any): void {
    if (!this.favoriteCenters.find(favCenter => favCenter.id === center.id)) {
      this.favoriteCenters.push(center);
    }
  }

  navigateToFavorites(): void {
    this.router.navigate(['/favorite-center']);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  getPaginatedCenters(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCenters.slice(startIndex, startIndex + this.itemsPerPage);
  }

  truncateDescription(description: string): string {
    const words = description.split(' ');
    if (words.length > 10) {
      return words.slice(0, 10).join(' ') + '...';
    }
    return description;
  }
}
