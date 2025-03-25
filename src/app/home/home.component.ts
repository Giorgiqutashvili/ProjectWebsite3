import { Component, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../api.service';
import { CategoriesComponent } from '../categories/categories.component';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CategoriesComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(public service: ApiService, public renderer: Renderer2, public cookie: CookieService) {
    this.getAll(this.pageNumber);
    this.isUser = this.cookie.check('user')
  }

  

  public allProducts: any;
  public productID: any;
  public withoutImage: any = 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg';
  public cart: any;
  public pageList: number [] = []
  public pageNumber: any = 1
  public productExists:any;
  public isUser :any;

  
  
  getAll(page:any) {
    this.pageNumber = page
    this.pageList = []
    this.service.getAllProducts(this.pageNumber).subscribe({
      next: (data: any) => {
        this.allProducts = data.products;
        let maxPage = Math.ceil(data.total / data.limit)

        for (let i = 1; i <= maxPage; i++) {
          this.pageList.push(i)
          
        }
        console.log(this.pageList)
      },
      error: (err: any) => {
        console.log('Connection Problem!', err);
      },
    });
  }

  public isCartID: any;

  sendToDetailsItemId(itemID:any){
    this.service.sendItemId.next(itemID)
    console.log(itemID)
  }
  

  filterThings(things: any) {
    this.allProducts = things;
    console.log("Updated Products:", this.allProducts);
  }
  
  showPopup() {
    this.productExists = true;
    this.renderer.addClass(document.body, 'popup-active'); 
  }

  hidePopup() {
    this.productExists = false;
    this.renderer.removeClass(document.body, 'popup-active'); 
  }

  public productAdded: boolean = false;

  addToCart(item: any) {
    let cartData = {
      id: item._id,
      quantity: 1,
    };
  
    this.service.getUser().subscribe({
      next: (data: any) => {
        this.service.cartIDSender.next(data.cartID);
        
        if (data.cartID) {
          this.service.getCart().subscribe({
            next: (cart: any) => {
              const existingProduct = cart.products.find(
                (p: any) => p.productId === item._id
              );
  
              if (existingProduct) {
                this.productExists = true;
              } else {
                this.productExists = false;
                
                this.service.patchCart(cartData).subscribe({
                  next: () => {
                    this.productAdded = true; // Show the pop-up when added
                    document.body.style.overflow = "hidden"; // Disable scrolling when pop-up is visible
                  },
                  error: (err: any) => console.log(err),
                });
              }
            },
            error: (err: any) => console.log(err),
          });
        } else {
          this.service.createCart(cartData).subscribe({
            next: () => {
              this.productAdded = true; // Show pop-up when a new cart is created
              document.body.style.overflow = "hidden";
            },
            error: (data: any) => console.log(data),
          });
        }
      },
      error: (err: any) => console.log(err),
    });
  }
  
  // Function to close the pop-up
  hideProductAddedPopup() {
    this.productAdded = false;
    document.body.style.overflow = "auto"; // Re-enable scrolling when pop-up is closed
  }
  
}
