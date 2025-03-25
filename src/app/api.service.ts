import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}


  public cartIDSender: BehaviorSubject<any> = new BehaviorSubject(null);

  public cookieCheckSender: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public sendItemId: BehaviorSubject<any> = new BehaviorSubject("")

  public loaderSent: BehaviorSubject<boolean> = new BehaviorSubject(false)

  loadingStart(){
    this.loaderSent.next(true)
  }

  loadingStop(){
    this.loaderSent.next(false)
  }
  

  getAllProducts(page: any) {
    return this.http.get(
      `https://api.everrest.educata.dev/shop/products/all?page_index=${page}&page_size=20`
    );
  }

  filtering(params: any) {
    let queryParams: any = {};

    if (params.keywords) queryParams['keywords'] = params.keywords;
    if (params.category_id) queryParams['category_id'] = params.category_id;
    if (params.brand) queryParams['brand'] = params.brand;
    if (params.rating) queryParams['rating'] = params.rating;
    if (params.price_min) queryParams['price_min'] = params.price_min;
    if (params.price_max) queryParams['price_max'] = params.price_max;
    if (params.sort_by) queryParams['sort_by'] = params.sort_by;
    if (params.sort_direction) queryParams['sort_direction'] = params.sort_direction;

    let queryString = new URLSearchParams(queryParams).toString();

    return this.http.get(
      `https://api.everrest.educata.dev/shop/products/search?page_index=1&page_size=20&${queryString}`
    );
  }

  getBrands() {
    return this.http.get(
      'https://api.everrest.educata.dev/shop/products/brands'
    );
  }

  getBrandsByName(name: any) {
    return this.http.get(
      `https://api.everrest.educata.dev/shop/products/brand/${name}`
    );
  }

  signIn(body: any) {
    return this.http.post(
      'https://api.everrest.educata.dev/auth/sign_in',
      body
    );
  }

  getUser() {
    return this.http.get('https://api.everrest.educata.dev/auth');
  }

  postSignUp(body: any) {
    return this.http.post(
      'https://api.everrest.educata.dev/auth/sign_up',
      body
    );
  }

  createCart(body: any) {
    return this.http.post(
      'https://api.everrest.educata.dev/shop/cart/product',
      body
    );
  }

  patchCart(body: any) {
    return this.http.patch(
      'https://api.everrest.educata.dev/shop/cart/product',
      body
    );
  }

  getCart() {
    return this.http.get('https://api.everrest.educata.dev/shop/cart');
  }

  getCartProducts(id: any) {
    return this.http.get(
      `https://api.everrest.educata.dev/shop/products/id/${id}`
    );
  }

  deleteProductFromCart(id: string) {
    const body = { id: id };
    return this.http.delete(
      `https://api.everrest.educata.dev/shop/cart/product/`,
      {
        body: body,
      }
    );
  }

  updateProductQuantity(id: string, newQuantity: any) {
    return this.http.patch(
      'https://api.everrest.educata.dev/shop/cart/product',
      {
        id: id,
        quantity: newQuantity,
      }
    );
  }

  postCheckout(cartID: any) {
    return this.http.post(
      'https://api.everrest.educata.dev/shop/cart/checkout',
      cartID
    );
  }

  rateProduct(body:any){
    return this.http.post("https://api.everrest.educata.dev/shop/products/rate", body)
  }
}
