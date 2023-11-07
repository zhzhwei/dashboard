import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { StackedBarEditorComponent } from './edition/stackedbareditor/stackedbareditor.component';
const routes: Routes = [
    { path: 'stacked', component: StackedBarEditorComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
