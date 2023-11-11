import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridStackComponent } from './gridstack.component';
import { BarChartComponent } from '../diagram/bar-chart/bar-chart.component';
import { StackedBarChartComponent } from '../diagram/stacked-bar-chart/stacked-bar-chart.component';
import { StarPlotComponent } from '../diagram/star-plot/star-plot.component';
import { PieChartComponent } from '../diagram/pie-chart/pie-chart.component';

@NgModule({
    imports: [CommonModule],
    declarations: [
        GridStackComponent,
        BarChartComponent,
        StackedBarChartComponent,
        StarPlotComponent,
        PieChartComponent
    ],
    exports: [GridStackComponent]
})
export class GridStackModule { }
