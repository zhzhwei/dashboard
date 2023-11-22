import { Component, OnInit, ViewChild } from '@angular/core';
import { RdfDataService } from '../../services/rdf-data.service';
import { ChartService } from 'src/app/services/chart.service';
import { MatDialog } from '@angular/material/dialog';
import * as d3 from 'd3';

@Component({
    selector: 'app-star-plot-editor',
    templateUrl: './star-plot-editor.component.html',
})
export class StarPlotEditorComponent implements OnInit {
    ngOnInit(): void {

    }
}