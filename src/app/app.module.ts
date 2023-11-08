import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StackedBarEditorComponent } from './dialog/stacked-bar-editor/stacked-bar-editor.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { GridStackModule } from './gridstack/gridstack.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { VisGenComponent } from './dialog/vis-gen/vis-gen.component';

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
        StackedBarEditorComponent,
        VisGenComponent
    ],
    bootstrap: [
        AppComponent
    ],
})
export class AppModule { }