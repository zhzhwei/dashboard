import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { FlexLayoutModule } from '@angular/flex-layout';

import { GridStackModule } from './gridstack/gridstack.module';
import { VisGenModule } from './dialog/vis-gen-dialog/vis-gen-dialog.module';

import { AppComponent } from './app.component';
import { BarChartEditorComponent } from './dialog/bar-chart-editor/bar-chart-editor.component';
import { StackedBarEditorComponent } from './dialog/stacked-bar-editor/stacked-bar-editor.component';
import { PieChartEditorComponent } from './dialog/pie-chart-editor/pie-chart-editor.component';
import { StarPlotEditorComponent } from './dialog/star-plot-editor/star-plot-editor.component';
import { LineChartEditorComponent } from './dialog/line-chart-editor/line-chart-editor.component';
import { DoughnutEditorComponent } from './dialog/doughnut-editor/doughnut-editor.component';
import { DeleteConfirmationComponent } from './dialog/delete-confirmation/delete-confirmation.component';

@NgModule({
    imports: [
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
        MatRadioModule,
        FlexLayoutModule,
        GridStackModule,
        VisGenModule,
    ],
    declarations: [
        AppComponent,
        BarChartEditorComponent,
        StackedBarEditorComponent,
        PieChartEditorComponent,
        StarPlotEditorComponent,
        LineChartEditorComponent,
        DoughnutEditorComponent,
        DeleteConfirmationComponent
    ],
    bootstrap: [
        AppComponent
    ],
})
export class AppModule { }