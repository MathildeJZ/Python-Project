    import { Component } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { FormsModule } from '@angular/forms';

    @Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
    })
    export class HomeComponent {

    soldPlace: string = '';
    delivery: string = '';
    soldWithOthers: boolean = false;

    amount: number = 1;
    otherBooks: string[] = [];

    searchValue: string = '';
    books: any[] = [];

    updateOtherBooks() {
        this.otherBooks = Array(this.amount).fill('');
    }
    }
