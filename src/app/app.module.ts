import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridStackModule } from './gridstack/gridstack.module';
import { BarChartComponent } from './barchart/barchart.component';

@NgModule({
  imports: [BrowserModule, GridStackModule],
  declarations: [AppComponent, BarChartComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
