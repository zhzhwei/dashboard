import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VisGenComponent } from './dialog/vis-gen/vis-gen.component';
import { ChartService } from './services/chart.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    
    constructor(public dialog: MatDialog, private chartService: ChartService) { }
    
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

    loadDiagram() {
        this.chartService.loadChart();
    }
}