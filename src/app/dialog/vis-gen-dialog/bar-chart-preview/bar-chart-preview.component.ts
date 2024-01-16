import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bar-chart-preview',
  templateUrl: './bar-chart-preview.component.html',
  styleUrls: ['./bar-chart-preview.component.css']
})
export class BarChartPreviewComponent implements OnInit {
    @Input() queryParameters: any; // Assuming any type for queryParameters, replace it with the actual type if possible


  constructor() { }

  ngOnInit(): void {
  }

  logQueryParameters() {
    console.log('Query Parameters:', this.queryParameters);
  }

}
