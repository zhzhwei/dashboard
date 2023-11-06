import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConfirmationDialog } from './confirmation-dialog.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { GridStackModule } from './gridstack/gridstack.module';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        GridStackModule,
        HttpClientModule,
        AppRoutingModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule
    ],
    declarations: [
        AppComponent,
        ConfirmationDialog,
    ],
    entryComponents: [ConfirmationDialog],
    bootstrap: [
        AppComponent
    ],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
})
export class AppModule { }
