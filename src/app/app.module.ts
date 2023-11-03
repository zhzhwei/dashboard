import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { GridStackModule } from './gridstack/gridstack.module';
import { BarChartComponent } from './barchart/barchart.component';
import { StackedBarChartComponent } from './stackbarchart/stackbarchart.component';
import { StarPlotComponent } from './starplot/starplot.component';
import { StackBarEditorComponent } from './edition/stackbareditor/stackbareditor.component';

@NgModule({
    imports: [
        BrowserModule,
        GridStackModule,
        HttpClientModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        BarChartComponent,
        StackedBarChartComponent,
        StarPlotComponent,
        StackBarEditorComponent
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [{provide: APP_BASE_HREF, useValue: '/'}]
})
export class AppModule { }
