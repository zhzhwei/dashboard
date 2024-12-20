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
import { MatTooltipModule } from '@angular/material/tooltip';

import { VisGenDialogComponent } from './vis-gen-dialog.component';
import { BarChartPreviewComponent } from './bar-chart-preview/bar-chart-preview.component';
import { LineChartPreviewComponent } from './line-chart-preview/line-chart-preview.component';

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
        MatTooltipModule
    ],
    declarations: [
        VisGenDialogComponent,
        BarChartPreviewComponent,
        LineChartPreviewComponent,
    ],
    // exports: [VisGenComponent]
})
export class VisGenModule { }
