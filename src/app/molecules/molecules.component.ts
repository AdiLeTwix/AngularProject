import { Component, Input, Output, EventEmitter } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-search-input',
  templateUrl: './molecules.component.html',
  styleUrls: ['./molecules.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  standalone: true
})

export class SearchInputComponent {
  @Input() city: string = 'Paris';
  @Output() cityChange = new EventEmitter<string>();

  onCityChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.city = inputElement.value;
  }

  onButtonClick(): void {
    console.log(this.city);
    this.cityChange.emit(this.city);
  }
}
