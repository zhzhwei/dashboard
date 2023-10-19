import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridStackModule } from './gridstack/gridstack.module';

@NgModule({
  imports: [BrowserModule, GridStackModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
