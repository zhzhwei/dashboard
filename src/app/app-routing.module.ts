import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { StackBarEditorComponent } from './edition/stackbareditor/stackbareditor.component';
import { GridStackComponent } from './gridstack/gridstack.component';

const routes: Routes = [
    { path: 'stack', component: StackBarEditorComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
