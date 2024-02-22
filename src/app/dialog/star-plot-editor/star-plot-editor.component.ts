import { Component, OnInit, ViewChild } from '@angular/core';
import { RdfDataService } from '../../services/rdf-data.service';
import { ChartService } from '../../services/chart.service';
import { MatDialog } from '@angular/material/dialog';
import * as d3 from 'd3';

@Component({
    selector: 'app-star-plot-editor',
    templateUrl: './star-plot-editor.component.html',
})
export class StarPlotEditorComponent implements OnInit {

    constructor(private dialog: MatDialog, private chartService: ChartService) { }

    ngOnInit(): void {

    }
    
    backToDashboard(): void {
        this.dialog.closeAll();
        this.chartService.starPlot.next(true);
    }
}