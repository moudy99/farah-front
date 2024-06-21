import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-photographer',
  standalone: true,
  templateUrl: './photographer.component.html',
  imports: [CommonModule, RouterLink, FormsModule],
  styleUrls: ['./photographer.component.scss']
})
export class PhotographerComponent implements OnInit {
  photographers = [
    { id: 1, name: 'مصور 1', imageUrl: 'https://st3.depositphotos.com/12985790/16650/i/1600/depositphotos_166506298-stock-photo-male-photographer-with-digital-camera.jpg', price: 3000, description: 'الوصف', city: 'القاهرة', town: 'القاهرة' },
    { id: 2, name: 'مصور 2', imageUrl: 'https://st2.depositphotos.com/3662505/5821/i/950/depositphotos_58212791-stock-photo-tourists.jpg', price: 4000, description: 'الوصف', city: 'الإسكندرية', town: 'الإسكندرية' },
    { id: 3, name: 'مصور 3', imageUrl: 'https://previews.123rf.com/images/cc0collection/cc0collection2205/cc0collection220540765/186116451-people-man-photographer-photography-canon-camera-lens-kit-dslr-picture-photo.jpg', price: 5000, description: 'الوصف', city: 'الجيزة', town: 'الجيزة' },
    { id: 4, name: 'مصور 4', imageUrl: 'https://previews.123rf.com/images/stockbroker/stockbroker1702/stockbroker170200834/71258399-studio-portrait-of-male-photographer-with-camera.jpg', price: 2000, description: 'الوصف', city: 'بورسعيد', town: 'بورسعيد' }
  ];

  currentPage: number = 1;
  itemsPerPage: number = 16;
  selectedCity: string = '';
  selectedTown: string = '';
  maxPrice = 5000;
  priceRange: { min: number; max: number } = { min: 1000, max: 5000 };
  favoritePhotographers: any[] = [];

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
    this.filterPhotographers();
  }

  get filteredPhotographers() {
    return this.photographers.filter(photographer => {
      return (!this.selectedTown || photographer.town === this.selectedTown)
        && (!this.selectedCity || photographer.city === this.selectedCity)
        && (photographer.price <= this.maxPrice);
    });
  }

  filterPhotographers() {
    this.currentPage = 1;
  }

  addToFavorites(photographer: any): void {
    if (!this.favoritePhotographers.find(favPhotographer => favPhotographer.id === photographer.id)) {
      this.favoritePhotographers.push(photographer);
    }
  }

  navigateToFavorites(): void {
    this.router.navigate(['/favorite-photographer']);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  getPaginatedPhotographers(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPhotographers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  truncateDescription(description: string): string {
    const words = description.split(' ');
    if (words.length > 10) {
      return words.slice(0, 10).join(' ') + '...';
    }
    return description;
  }
}
