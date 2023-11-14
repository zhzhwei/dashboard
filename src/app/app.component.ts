import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VisGenComponent } from './dialog/vis-gen/vis-gen.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    
    constructor(public dialog: MatDialog) { }
    
    ngOnInit() {

    }

    openDialog() {
        this.dialog.open(VisGenComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }
}