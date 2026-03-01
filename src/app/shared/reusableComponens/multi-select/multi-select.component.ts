import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';



@Component({
  selector: 'app-multi-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatAutocompleteModule 
  ],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.css'
})
export class MultiSelectComponent {

  @Input() placeholder: string='Search...';
  @Input() options:any[]=[];
  @Output() selectedData = new EventEmitter();

  myControl: FormControl = new FormControl();

  filteredOptions!: Observable<any[]>;

  ngOnInit() {
    
  }


  ngOnChanges() {
    console.log(this.options)
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );

      this.myControl.valueChanges.subscribe( (value: any) => {
        if(!value) {
          this.selectedData.emit('');
        }
      })
  }

  filter(val: string): string[] {
    return this.options.filter(option =>
      option?.value.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.selectedData.emit(event.option.value);
  }
}
