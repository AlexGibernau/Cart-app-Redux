import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartItem } from '../../models/cartItem';

@Component({
    selector: 'navbar',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
    @Input() items: CartItem[] = [];
    @Input() total: number = 0;
}
