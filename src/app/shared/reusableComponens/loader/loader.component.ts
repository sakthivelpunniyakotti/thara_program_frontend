import { Component } from '@angular/core';
import { LoaderService } from '../../../core/service/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  isLoading = false;

  constructor(private loaderService:LoaderService){
     this.loaderService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }
      
}
