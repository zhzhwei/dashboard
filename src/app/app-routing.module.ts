import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { StackedBarEditorComponent } from './dialog/stacked-bar-editor/stackedbareditor.component';
const routes: Routes = [
    { path: 'stacked', component: StackedBarEditorComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
