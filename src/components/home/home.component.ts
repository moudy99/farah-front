import { Component } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { HallComponent } from '../hall/hall.component';

import { CategoryComponent } from '../category/category.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SliderComponent, HallComponent,CategoryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
