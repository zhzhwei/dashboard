import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VisGenDialogComponent } from './dialog/vis-gen-dialog/vis-gen-dialog.component';
import { ChartService } from './services/chart.service';
import { GridHTMLElement } from 'gridstack';

import * as d3 from 'd3';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(public dialog: MatDialog, private chartService: ChartService) { }
    
    ngOnInit() {

    }

    openVisGenDialog() {
        this.dialog.open(VisGenDialogComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }

    toggleShowCharts() {
        let minorGridEl= document.querySelector('#minor-grid') as GridHTMLElement;
        if (minorGridEl.style.display === 'none') {
            minorGridEl.style.display = 'block';
        } else {
            minorGridEl.style.display = 'none';
        }
    }

    loadChart() {
        this.chartService.loadJsonFile();
    }

    removeAllCharts() {
        // this.chartService.removeAllCharts();
    }

}