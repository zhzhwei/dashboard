import { Component, OnInit, ViewChild } from '@angular/core';
import { RdfDataService } from '../../services/rdf-data.service';
import { ChartService } from '../../services/chart.service';
import { MatDialog } from '@angular/material/dialog';
import * as d3 from 'd3';

@Component({
    selector: 'app-line-chart-editor',
    templateUrl: './line-chart-editor.component.html',
})
export class LineChartEditorComponent implements OnInit {

    constructor(private dialog: MatDialog) { }

    ngOnInit(): void {

    }

    backToDashboard(): void {
        this.dialog.closeAll();
    }
}