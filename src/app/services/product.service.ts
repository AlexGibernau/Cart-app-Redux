import { Injectable } from '@angular/core';
import { products } from '../data/product.data';
import { Product } from '../models/product';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    constructor() {}

    findAll(): Product[] {
        return products;
    }
}
