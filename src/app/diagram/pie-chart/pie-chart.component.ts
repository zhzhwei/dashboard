import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../services/dialog.service';
import { ChartService } from '../../services/chart.service';
import { TitleIconService } from '../../services/icon.sevice';

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
    public pieRemove = false;

    constructor(private dialogService: DialogService, private chartService: ChartService,
        private titleIconService: TitleIconService) { }

    ngOnInit(): void { }

    public chartCreateOrUpdate(tileSerial: string, jobName: string, dataSource: any, pieLabel: string, action: string): void {
        var pieEL = document.getElementById(tileSerial);

        if (action === 'Create') {
            this.svg = d3.select('#' + tileSerial)
                .append('svg')
                .attr('width', pieEL.clientWidth)
                .attr('height', pieEL.clientHeight)
        } else {
            this.svg = d3.select('#' + tileSerial).select('svg')
                .attr('width', pieEL.clientWidth)
                .attr('height', pieEL.clientHeight)
        }

        if (action === 'Create') {
            this.addTitleIcon(this.svg, pieEL, tileSerial, jobName, dataSource, pieLabel);
        } else {
            this.titleIconService.updateTitleIcon(this.svg, pieEL, this.margin);
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

        if (action === 'Create') {
            this.g = this.svg.append('g')
                .attr('transform', 'translate(' + pieEL.clientWidth / 2 + ',' + pieEL.clientHeight / 2 + ')');
        } else {
            this.g = d3.select('#' + tileSerial).select('g') // define the g element as the existing g element
                .attr('transform', 'translate(' + pieEL.clientWidth / 2 + ',' + pieEL.clientHeight / 2 + ')');
        }

        // Bind the data to the pie chart and draw the arcs
        if (action === 'Create') {
            this.g.selectAll('path')
                .data(pie(dataSource))
                .enter()
                .append('path')
                .attr('d', (d: any) => arc(d))
                .attr('fill', (d) => color(d.data.label) as string)
                .on('mouseover', (d, i, nodes) => {
                    // Get the current bar element
                    var bar = d3.select(nodes[i]);

                    // Create the tooltip element
                    var tooltip = d3.select('#' + tileSerial)
                        .append('div')
                        .attr('class', 'tooltip')
                        .style('position', 'absolute')
                        .style('background-color', 'white')
                        .style('border', 'solid')
                        .style('border-width', '1px')
                        .style('border-radius', '5px')
                        .style('padding', '10px')
                        .style('opacity', 0);

                    // Show the tooltip element
                    d3.select('.tooltip')
                        .text(`${d.data.label}: ${d.data.value}`)
                        .transition()
                        .duration(200)
                        .style('opacity', 1);

                    // Change the color of the bar
                    // bar.style('fill', 'orange');

                    // Add a mousemove event listener to update the position of the tooltip element
                    d3.select('body')
                        .on('mousemove', () => {
                            var [x, y] = d3.mouse(nodes[i]);
                            // console.log(x, y);
                            tooltip.style('left', `${x + 250}px`)
                                .style('top', `${y + 200}px`);
                        });
                })
                .on('mouseout', (d, i, nodes) => {
                    // Get the current bar element
                    var bar = d3.select(nodes[i]);

                    // Hide the tooltip element
                    d3.select('.tooltip').remove();

                    // Change the color of the bar back to the original color
                    // bar.style('fill', color(d.data.label));
                });
        } else {
            this.g.selectAll('path')
                .attr('d', (d: any) => arc(d))
                .attr('fill', (d: any) => color((d as any).data.label) as string);
        }
    }

    private addTitleIcon(svg, pieEL, tileSerial, jobName, dataSource, pieLabel): void {
        this.titleIconService.createTitle(svg, pieEL.clientWidth / 2, this.margin / 2 + 5,
            (jobName ? jobName : "JobPosting") + " --- " + pieLabel);

        this.titleIconService.createIcon(svg, pieEL.clientWidth - 38, 20, 'pencil', () => {
            this.dialogService.openPieChartEditor('Edit', tileSerial, jobName);
            this.chartService.chartType.next('Pie Chart');
        });

        this.titleIconService.createIcon(svg, pieEL.clientWidth - 38, 45, 'download', () => {
            this.chartService.saveJsonFile('Pie Chart', dataSource, jobName, pieLabel);
        });

        const self = this;
        this.titleIconService.createIcon(svg, pieEL.clientWidth - 38, 70, 'heart', function () {
            const heart = d3.select(this).select('i');
            if (heart.style('color') === 'red') {
                heart.style('color', '');
                self.chartService.chartFavorite.next({ type: 'Pie Chart', serial: tileSerial, favorite: false });
                self.dialogService.openSnackBar('You have removed this diagram from your favorites', 'close');
            } else {
                heart.style('color', 'red');
                self.chartService.chartFavorite.next({ type: 'Pie Chart', serial: tileSerial, favorite: true });
                self.dialogService.openSnackBar('You have added this diagram into your favorites', 'close');
            }
        });

        this.titleIconService.createIcon(svg, pieEL.clientWidth - 36, 95, 'trash', () => {
            this.dialogService.openDeleteConfirmation('Pie Chart', tileSerial);
        });

        this.titleIconService.hoverSVG(svg);
    }

}
