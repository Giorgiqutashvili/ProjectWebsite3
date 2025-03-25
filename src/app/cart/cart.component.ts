import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  changeDetectorRef: any;
  constructor(public service: ApiService,) {
    this.getWholeCart();

    setTimeout(() => {
      if (this.productsFromCart.length > 0) {
        this.displayCart();
      }
    }, 500);

    setTimeout(() => {
      this.addProductQuantityInVar();
      console.log(this.cartProducts);
    }, 1500);
  }

  public checkoutSuccess: any;
  public cartProductQuantity: any;
  public productsFromCart: any[] = [];
  public cartProducts: any[] = [];
  public withoutImage: any =
    'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg';
  public eachItemsQuantityInCart: number = 1;
  public totalPrice: number = 0;
  public cartID: any;

  deleteProduct(id: any) {
    this.service.deleteProductFromCart(id).subscribe({
      next: () => {
        this.cartProducts = this.cartProducts.filter((item) => item._id !== id);
        console.log('Updated cart products:', this.cartProducts);
        this.totalPrice = this.cartProducts.reduce(
          (sum, item) =>
            sum + Number(item.quantity) * Number(item.price?.current || 0),
          0
        );
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  getWholeCart() {
    this.service.getCart().subscribe({
      next: (data: any) => {
        this.cartProductQuantity = data.total.quantity;
        this.totalPrice = data.total.price.current;
        this.productsFromCart = data.products;
        console.log(this.cartProductQuantity);
        console.log('price:', this.totalPrice);
        console.log('Cart Quantity:', this.cartProductQuantity);
        console.log('Products in Cart:', this.productsFromCart);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  displayCart() {
    if (!this.productsFromCart || this.productsFromCart.length === 0) {
      console.log('No products in cart.');
      return;
    }

    for (let i = 0; i < this.cartProductQuantity; i++) {
      console.log(this.productsFromCart[i].productId, i);

      this.service
        .getCartProducts(this.productsFromCart[i].productId)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.cartProducts.push(data);
            console.log(this.cartProducts);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }

  addProductQuantityInVar() {
    this.cartProducts.forEach((product) => {
      const quantityObj = this.productsFromCart.find(
        (item) => item.productId === product._id
      );

      if (quantityObj) {
        product.quantity = quantityObj.quantity;
      }
    });
  }

  changeQuantity(id: string, newQuantity: any, event: any) {
    if (event.target.className == 'minus' && newQuantity < 1) {
      console.log(event.target.className);
      this.deleteProduct(id);
      this.totalPrice = this.cartProducts.reduce(
        (sum, item) =>
          sum + Number(item.quantity) * Number(item.price?.current || 0),
        0
      );
      return;
    }

    console.log(newQuantity);

    this.service.updateProductQuantity(id, Number(newQuantity)).subscribe({
      next: (data: any) => {
        console.log(data.products);

        this.cartProducts = this.cartProducts.map((item) => {
          const updatedProduct = data.products.find(
            (p: { productId: any }) => p.productId === item._id
          );

          return updatedProduct
            ? { ...item, quantity: updatedProduct.quantity }
            : item;
        });

        this.totalPrice = 0;
        for (const item of this.cartProducts) {
          if (item.quantity > 0) {
            this.totalPrice +=
              Number(item.quantity) * Number(item.price?.current || 0);
          } else {
            this.totalPrice += 0;
          }
        }

        console.log(Number(this.totalPrice));
      },
      error: (err: any) => {
        console.log('Error updating quantity:', err);
      },
    });
  }

  checkout() {
    this.service.cartIDSender.subscribe({
      next: (data: any) => {
        this.cartID = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    this.service.postCheckout(this.cartID).subscribe({
      next: (data: any) => {
        if (data.success == true) {
          // Empty the cart and set checkout success
          this.cartProductQuantity = 0;
          this.productsFromCart = [];
          this.cartProducts = [];
          this.eachItemsQuantityInCart = 0;
          this.totalPrice = 0;
          this.cartID = null;
          this.checkoutSuccess = true;

          // Disable scrolling when popup is active
          document.body.style.overflow = "hidden";
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  

  closePopup() {
    this.checkoutSuccess = false;

    // Re-enable scrolling
    document.body.style.overflow = "auto";
  }
}

