import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-details',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  constructor(public service: ApiService) {
    this.catchItemID();
    this.getItemWithId();
  }


  public sentItemId: any;
  public item: any;
  public withoutImage: any = 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg';
  public rating: number = 0;  
  public stars: number[] = [1, 2, 3, 4, 5];  
  public isRatingModalOpen: boolean = false; 
  public isRatingSent: boolean = false;  

  
  catchItemID() {
    this.service.sendItemId.subscribe({
      next: (data: any) => {
        this.sentItemId = data;
        console.log(data);
      },
      error: (err: any) => console.log(err),
    });
  }

  getItemWithId() {
    this.service.getCartProducts(this.sentItemId).subscribe({
      next: (data: any) => {
        this.item = data;
        console.log(data);
      },
      error: (err: any) => console.log(err),
    });
  }

 
  openRatingModal() {
    this.isRatingModalOpen = true;
  }

 
  closeRatingModal() {
    this.isRatingModalOpen = false;
  }

 
  selectRating(star: number) {
    this.rating = star;
  }

  
  submitRating() {
    if (this.rating > 0) {
      const body = { productId: this.item._id, rate: this.rating };
      this.service.rateProduct(body).subscribe({
        next: (data: any) => {
          console.log('Rating sent:', data);
          this.isRatingSent = true;  
          setTimeout(() => this.closeConfirmation(), 3000);  
        },
        error: (err: any) => {
          console.log('Error:', err);
        }
      });
    }
  }

  
  closeConfirmation() {
    this.isRatingSent = false;
    this.closeRatingModal(); 
  }
}
