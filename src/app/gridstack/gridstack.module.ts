import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridStackComponent } from './gridstack.component';
import { BarChartComponent } from '../diagram/bar-chart/barchart.component';
import { StackedBarChartComponent } from '../diagram/stacked-bar-chart/stackedbarchart.component';
import { StarPlotComponent } from '../diagram/star-plot/starplot.component';

@NgModule({
    declarations: [
        GridStackComponent,
        BarChartComponent,
        StackedBarChartComponent,
        StarPlotComponent
    ],
    imports: [CommonModule],
    exports: [GridStackComponent]
})
export class GridStackModule { }
