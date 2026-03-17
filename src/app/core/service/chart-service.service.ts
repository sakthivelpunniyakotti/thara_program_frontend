import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartServiceService {

  private chartOptions:any;

  constructor() { }

  pieChart(data: any):any{

    console.log(data,'ddddddddd')
      this.chartOptions = {
    chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45,
            beta: 0
        }
    },
    title: {
        text: `Home work pie chart view for ${data?.name} of grade ${data?.grade}`
    },
    subtitle: {
        text: ''
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            depth: 35,
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }
    },
    credits: {
    enabled: true,
    text: 'Thara',
    href:''
    },
    exporting: {
  enabled: true,
  buttons: {
    contextButton: {
      menuItems: [
        'downloadCSV',
        'downloadXLS'   // ✅ Excel option
      ]
    }
  }
},
    series: [{
        type: 'pie',
        name: 'Share',
        data: data?.data        
    }]
}

console.log(data)
  return this.chartOptions;
  }
}
