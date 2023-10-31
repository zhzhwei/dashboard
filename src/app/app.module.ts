import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GridStackModule } from './gridstack/gridstack.module';
import { BarChartComponent } from './barchart/barchart.component';
import { StackedBarChartComponent } from './stackbarchart/stackbarchart.component';
import { StarPlotComponent } from './starplot/starplot.component';

@NgModule({
    imports: [BrowserModule, GridStackModule, HttpClientModule],
    declarations: [AppComponent, BarChartComponent, StackedBarChartComponent, StarPlotComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
