import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

export interface Filter {
    value: string;
    viewValue: string;
}

@Component({
    selector: 'select-form',
    templateUrl: 'select.component.html',
    styleUrls: ['select.component.css'],
    imports: [
        MatFormField,
        MatSelect,
        MatOption,
        FormsModule,
        NgForOf
    ],
    standalone: true
})

export class SelectForm {
    @Input() selectedValue: string = 'daily';
    @Output() filterChange = new EventEmitter<string>();

    filters: Filter[] = [
        { value: 'daily', viewValue: 'Daily' },
        { value: 'weekly', viewValue: 'Weekly' }
    ];

    onFilterChange(newFilter: string): void {
        this.selectedValue = newFilter;
        this.filterChange.emit(newFilter);
    }
}