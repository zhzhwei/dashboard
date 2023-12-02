import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../services/dialog.service';
import { ChartService } from '../../services/chart.service';
import { IconService } from 'src/app/services/icon.sevice';

import * as d3 from 'd3';

interface Datum {
    label: string;
    value: number;
}

@Component({
    selector: 'app-pie-chart',
})
export class PieChartComponent implements OnInit {

    private svg: any;
    private g: any;
    private margin = 60;
    public pieRemoved = false;

    constructor(private dialogService: DialogService, private chartService: ChartService,
        private iconService: IconService) { }

    ngOnInit(): void { }

    public chartCreateOrUpdate(tileSerial: string, jobName: string, dataSource: any, pieLabel: string, isCreate: boolean): void {
        var pieEL = document.getElementById(tileSerial);

        if (isCreate) {
            this.svg = d3.select('#' + tileSerial)
                .append('svg')
                .attr('width', pieEL.clientWidth)
                .attr('height', pieEL.clientHeight)
        } else {
            this.svg = d3.select('#' + tileSerial).select('svg')
                .attr('width', pieEL.clientWidth)
                .attr('height', pieEL.clientHeight)
        }

        if (isCreate) {
            this.addTitleIcon(this.svg, pieEL, tileSerial, jobName, dataSource, pieLabel);
        } else {
            this.updateTitleIcon(pieEL);
        }

        var radius = Math.min(pieEL.clientWidth, pieEL.clientHeight) / 2 - this.margin;

        // Define the color scale
        var color = d3.scaleOrdinal()
            .domain(dataSource.map(d => d.label))
            .range(d3.schemeCategory10);

        // Define the pie function
        var pie = d3.pie<Datum>()
            .value((d: Datum) => d.value)
            .sort(null);

        // Define the arc function
        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        if (isCreate) {
            this.g = this.svg.append('g')
                .attr('transform', 'translate(' + pieEL.clientWidth / 2 + ',' + pieEL.clientHeight / 2 + ')');
        } else {
            this.g = d3.select('#' + tileSerial).select('g') // define the g element as the existing g element
                .attr('transform', 'translate(' + pieEL.clientWidth / 2 + ',' + pieEL.clientHeight / 2 + ')');
        }

        // Bind the data to the pie chart and draw the arcs
        if (isCreate) {
            this.g.selectAll('path')
                .data(pie(dataSource))
                .enter()
                .append('path')
                .attr('d', (d: any) => arc(d))
                .attr('fill', (d) => color(d.data.label) as string);
        } else {
            this.g.selectAll('path')
                .attr('d', (d: any) => arc(d))
                .attr('fill', (d: any) => color((d as any).data.label) as string);
        }
    }

    private addTitleIcon(svg, pieEL, tileSerial, jobName, dataSource, pieLabel): void {
        this.iconService.createTitle(svg, pieEL.clientWidth / 2, this.margin / 2 + 5,
            (jobName ? jobName : "JobPosting") + " --- " + pieLabel);

        this.iconService.createIcon(svg, pieEL.clientWidth - 38, 20, 'pencil', () => {
            this.dialogService.openPieChartEditor('Edit', tileSerial, jobName);
            this.chartService.chartType.next('Pie Chart');
        });

        this.iconService.createIcon(svg, pieEL.clientWidth - 38, 45, 'download', () => {
            this.chartService.saveJsonFile('Pie Chart', dataSource, jobName, pieLabel);
        });

        const self = this;
        this.iconService.createIcon(svg, pieEL.clientWidth - 38, 70, 'heart', function () {
            const heart = d3.select(this).select('i');
            if (heart.style('color') === 'red') {
                heart.style('color', '');
                self.chartService.diagramFavorite.next({ type: 'Pie Chart', serial: tileSerial, favorite: false });
                self.dialogService.openSnackBar('You have removed this diagram from your favorites', 'close');
            } else {
                heart.style('color', 'red');
                self.chartService.diagramFavorite.next({ type: 'Pie Chart', serial: tileSerial, favorite: true });
                self.dialogService.openSnackBar('You have added this diagram into your favorites', 'close');
            }
        });

        this.iconService.createIcon(svg, pieEL.clientWidth - 36, 95, 'trash', () => {
            this.dialogService.openDeleteConfirmation('Pie Chart', tileSerial);
        });

        this.iconService.hoverSVG(svg);
    }

    private updateTitleIcon(pieEL): void {
        this.svg.select("text.title")
            .attr("x", (pieEL.clientWidth / 2))
            .attr("y", this.margin / 2 + 5)

        this.svg.select('foreignObject.pencil')
            .attr('x', pieEL.clientWidth - 38)
            .attr('y', 20)

        this.svg.select('foreignObject.download')
            .attr('x', pieEL.clientWidth - 38)
            .attr('y', 45)

        this.svg.select('foreignObject.heart')
            .attr('x', pieEL.clientWidth - 38)
            .attr('y', 70)

        this.svg.select('foreignObject.trash')
            .attr('x', pieEL.clientWidth - 36)
            .attr('y', 95)
    }
}
