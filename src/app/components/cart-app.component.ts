import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { CartItem } from '../models/cartItem';
import { ProductService } from '../services/product.service';
import { SharingDataService } from '../services/sharing-data.service';
import { CatalogComponent } from './catalog/catalog.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
    selector: 'cart-app',
    standalone: true,
    imports: [CatalogComponent, NavbarComponent, RouterOutlet],
    templateUrl: './cart-app.component.html',
})
export class CartAppComponent implements OnInit {
    items: CartItem[] = [];
    total: number = 0;

    constructor(
        private router: Router,
        private sharingDataService: SharingDataService,
        private service: ProductService
    ) {}

    ngOnInit(): void {
        this.items = JSON.parse(sessionStorage.getItem('cart') || '[]');
        this.calculateTotal();
        this.onDeleteCart();
        this.onAddCart();
    }
    onAddCart(): void {
        this.sharingDataService.productEventEmitter.subscribe((product) => {
            const hasItem = this.items.find(
                (item) => item.product.id === product.id
            );
            if (hasItem) {
                this.items = this.items.map((item) => {
                    if (item.product.id === product.id) {
                        return {
                            ...item,
                            quantity: item.quantity + 1,
                        };
                    }
                    return item;
                });
            } else {
                this.items = [
                    ...this.items,
                    { product: { ...product }, quantity: 1 },
                ];
            }
            this.calculateTotal();
            this.saveSession();
            this.router.navigate(['/cart'], {
                state: { items: this.items, total: this.total },
            });
            Swal.fire({
                title: 'Shopping Cart',
                text: 'New product added to cart',
                icon: 'success',
            });
        });
    }
    onDeleteCart(): void {
        this.sharingDataService.idProductEventEmitter.subscribe((id) => {
            console.log(id + ' se ha ejecutado el evento');

            Swal.fire({
                title: 'Are you sure?',
                text: 'Warning! The item will be deleted from the cart',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.items = this.items.filter(
                        (item) => item.product.id !== id
                    );
                    if (this.items.length == 0) {
                        sessionStorage.removeItem('cart');
                    }
                    this.calculateTotal();
                    this.saveSession();
                    this.router
                        .navigateByUrl('/', { skipLocationChange: true })
                        .then(() => {
                            this.router.navigate(['/cart'], {
                                state: { items: this.items, total: this.total },
                            });
                        });
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Your item has been deleted.',
                        icon: 'success',
                    });
                }
            });
        });
    }
    calculateTotal(): void {
        this.total = this.items.reduce((acumulator, item) => {
            return acumulator + item.quantity * item.product.price;
        }, 0);
    }
    saveSession(): void {
        sessionStorage.setItem('cart', JSON.stringify(this.items));
    }
}
