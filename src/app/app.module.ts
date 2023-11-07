import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StackedBarEditorComponent } from './edition/stackedbareditor/stackedbareditor.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { GridStackModule } from './gridstack/gridstack.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        GridStackModule,
        HttpClientModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule,
        FormsModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatTableModule
    ],
    declarations: [
        AppComponent,
        StackedBarEditorComponent
    ],
    bootstrap: [
        AppComponent
    ],
})
export class AppModule { }