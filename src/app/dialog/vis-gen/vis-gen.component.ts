import { Component, OnInit, ViewChild } from '@angular/core';
import { BarChartComponent } from '../../diagram/bar-chart/bar-chart.component';
import { StackedBarChartComponent } from '../../diagram/stacked-bar-chart/stacked-bar-chart.component';
import { StarPlotComponent } from '../../diagram/star-plot/star-plot.component';
import { GridStackComponent } from '../../gridstack/gridstack.component';

declare var ResizeObserver: any;

@Component({
    selector: 'app-vis-gen',
    templateUrl: './vis-gen.component.html',
    styleUrls: ['./vis-gen.component.css']
})
export class VisGenComponent implements OnInit {

    constructor() { }

    public chartType: string;
    public gridStack: GridStackComponent;

  ngOnInit(): void {
  }

}
