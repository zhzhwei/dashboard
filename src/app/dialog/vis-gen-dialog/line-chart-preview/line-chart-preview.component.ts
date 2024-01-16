import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-line-chart-preview',
    templateUrl: './line-chart-preview.component.html',
    styleUrls: ['./line-chart-preview.component.css']
})
export class LineChartPreviewComponent implements OnInit {
    @Input() queryParameters: any;

    constructor() { }

    ngOnInit(): void {
    }

}
