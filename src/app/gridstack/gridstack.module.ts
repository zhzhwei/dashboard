import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridStackComponent } from './gridstack.component';
import { BarChartComponent } from '../diagram/bar-chart/bar-chart.component';
import { StackedBarChartComponent } from '../diagram/stacked-bar-chart/stacked-bar-chart.component';
import { StarPlotComponent } from '../diagram/star-plot/star-plot.component';

@NgModule({
    declarations: [
        GridStackComponent,
        // BarChartComponent,
        // StackedBarChartComponent,
        // StarPlotComponent
    ],
    imports: [CommonModule],
    exports: [GridStackComponent]
})
export class GridStackModule { }
