import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bar-chart-preview',
  templateUrl: './bar-chart-preview.component.html',
  styleUrls: ['./bar-chart-preview.component.css']
})
export class BarChartPreviewComponent implements OnInit {

    @Input() queryParameters: Object;
    @Input() selectProperties: string[];


  constructor() {
   }
    ngOnInit(): void {
    }

  logQueryParameters() {
    console.log('Query Parameters:', this.queryParameters);
    console.log('select properties (probably the more important ones):', this.selectProperties);
    
  }

}
