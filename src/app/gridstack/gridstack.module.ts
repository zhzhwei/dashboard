import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridStackComponent } from './gridstack.component';
import { BarChartComponent } from '../barchart/barchart.component';
import { StackedBarChartComponent } from '../stackbarchart/stackbarchart.component';
import { StarPlotComponent } from '../starplot/starplot.component';

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
