import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MultiSelectComponent } from '../../shared/reusableComponens/multi-select/multi-select.component';
import {HighchartsChartModule} from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import { ChartServiceService } from '../../core/service/chart-service.service';

Highcharts3D(Highcharts);


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SidebarComponent,MultiSelectComponent,HighchartsChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  // chart data
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions:any;

  constructor(private chartService: ChartServiceService){

  }

  ngOnInit(): void {
    this.chartOptions = this.chartService.pieChart();
  }

}
