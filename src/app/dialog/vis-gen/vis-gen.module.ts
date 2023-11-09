import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';

import { VisGenComponent } from './vis-gen.component';
import { BarChartComponent } from '../../diagram/bar-chart/bar-chart.component';
import { StackedBarChartComponent } from '../../diagram/stacked-bar-chart/stacked-bar-chart.component';
import { StarPlotComponent } from '../../diagram/star-plot/star-plot.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        MatNativeDateModule,
        MatTableModule,
    ],
    declarations: [
        VisGenComponent,
        BarChartComponent,
        StackedBarChartComponent,
        StarPlotComponent
    ],
    // exports: [VisGenComponent]
})
export class VisGenModule { }
