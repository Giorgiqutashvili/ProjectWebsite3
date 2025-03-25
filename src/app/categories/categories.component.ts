import { Component, EventEmitter, output, Output } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
Math: any;
  constructor(public service: ApiService) {
    this.allBrands();
  }

  public filters: any = {
    keywords: '',
    category_id: '',
    brand: '',
    rating: '',
    price_min: 100,
    price_max: 1000000,
    sort_by: '',
    sort_direction: '',
  };

  public brands: any;
  public search: any;
  public allThings: any [] = [];

  allBrands() {
    this.service.getBrands().subscribe({
      next: (data: any) => {
        this.brands = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  @Output() public sendAllThings: EventEmitter <any> = new EventEmitter();

  updateFilters() {
    this.service.filtering(this.filters).subscribe({
      next: (data: any) => {
        console.log(data);
        this.allThings = data.products;
        this.sendAllThings.emit(this.allThings);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  reset() {
    this.activeCategory = null;
    this.activeSortDirection = null;
    this.activeBrand = null;
    this.filters = {};
    this.minPrice = 100
    this.maxPrice = 100000;
    this.search = ""
    this.updateFilters()
  }

  filterBySearch() {
    this.filters.keywords = this.search;
    if (this.filters.keywords !== this.filters.brand){
      this.activeBrand = null;
      this.filters.brand = '';
    }
    this.updateFilters();
  }

  updateSorting(sortBy: string) {
    this.filters.sort_by = sortBy || null;
    this.filters.sort_direction = this.filters.sort_by ? 'asc' : null;
    this.updateFilters();
  }

  public minPrice: number = 100
  public maxPrice: number = 100000

  priceFiltering() {
    this.filters.price_min = Number(this.minPrice);  
    this.filters.price_max = Number(this.maxPrice); 
    console.log("Filtering by price:", this.filters.price_min, "-", this.filters.price_max);
    this.updateFilters();
  }

  filterWithButton() {
    this.filterBySearch();
    this.priceFiltering();
    this.updateFilters();
  }

  filterByRating(rating: any) {
    this.filters.rating = rating;
    console.log(this.filters.rating, 'fdsfs:', rating);
    this.updateFilters();
  }

  public activeCategory: string | null = null;
  public activeSortDirection: string | null = null;
  public activeBrand: string | null = null;

  categoryFiltering(categoryID: string) {
    if (this.activeCategory == categoryID) {
      this.activeCategory = null;
      this.filters.category_id = '';
    } else {
      this.activeCategory = categoryID;
      this.filters.category_id = categoryID;
    }
    this.updateFilters();
  }

  updateSortingDirection(direction: string) {
    if (this.activeSortDirection == direction) {
      this.activeSortDirection = null;
      this.filters.sort_direction = null;
    } else {
      this.activeSortDirection = direction;
      this.filters.sort_direction = direction;
    }
    this.updateFilters();
  }

  filterByBrand(name: string) {
    if (this.activeBrand === name) {
      this.activeBrand = null;
      this.filters.brand = '';
    } else {
      this.activeBrand = name;
      this.filters.brand = name;
    }
    if (this.filters.keywords !== this.filters.brand){
      this.search = ""
      this.filters.search = ""
      this.filters.brand = this.activeBrand
    }
    this.updateFilters();
  }
}
