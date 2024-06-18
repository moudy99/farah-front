import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-car',
  standalone: true,
  templateUrl: './car.component.html',
  imports: [CommonModule, RouterLink],
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {
  cars = [
    { id: 1,year:2021, imageUrl: 'https://www.topgear.com/sites/default/files/2023/08/P90492179_highRes_bmw-i7-xdrive60-m-sp%20%281%29.jpg', price: 'السعر', brand: 'العلامة التجارية', description: 'الوصف' },
    { id: 2,year:2010, imageUrl: 'https://carwow-uk-wp-3.imgix.net/front-1-RS6-Etron-2-e1674560152374.png?auto=format&cs=tinysrgb&fit=crop&h=800&ixlib=rb-1.1.0&q=60&w=1600', price: 'السعر', brand: 'العلامة التجارية', description: 'الوصف' },
    { id: 3,year:2020, imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/2022-kia-forte-gt-104-1633972551.jpg?crop=0.686xw:0.515xh;0.0943xw,0.217xh&resize=1200:*', price: 'السعر', brand: 'العلامة التجارية', description: 'الوصف' },
    { id: 4,year:2011, imageUrl: 'https://www.egy-car.com/wp-content/uploads/2020/09/%D9%87%D9%8A%D9%88%D9%86%D8%AF%D8%A7%D9%8A-%D8%A7%D9%84%D9%86%D8%AA%D8%B1%D8%A7-CN7-1-600x400.jpg', price: 'السعر', brand: 'العلامة التجارية', description: 'الوصف' }
  ];

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 16;
  favoriteCars: any[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void { }

 
  addToFavorites(car: any): void {
    if (!this.favoriteCars.find(favCar => favCar.id === car.id)) {
      this.favoriteCars.push(car);
    }
  }

  navigateToFavorites(): void {
    this.router.navigate(['/favorite-car']);
  }

  // Pagination methods
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  getPaginatedCars(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.cars.slice(startIndex, startIndex + this.itemsPerPage);
  }

  truncateDescription(description: string): string {
    const words = description.split(' ');
    if (words.length > 10) {
      return words.slice(0, 10).join(' ') + '...';
    }
    return description;
  }
}
