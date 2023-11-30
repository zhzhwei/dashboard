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
    private margin = 60;
    private pieEL: any;
    private radius: number;
    private color: any;
    private arc: any;
    private g: any;
    public pieRemoved = false;

    constructor(private dialogService: DialogService, private chartService: ChartService, 
        private iconService: IconService) { }

    ngOnInit(): void { }

    public createChart(tileSerial: string, jobName: string, dataSource: any, pieLabel: string): void {
        this.pieEL = document.getElementById(tileSerial);
        // console.log(this.pieEL.clientWidth, this.pieEL.clientHeight);

        // Clear the item's content
        while (this.pieEL.firstChild) {
            this.pieEL.removeChild(this.pieEL.firstChild);
        }

        this.svg = d3.select('#' + tileSerial)
            .append('svg')
            .attr('width', this.pieEL.clientWidth)
            .attr('height', this.pieEL.clientHeight)
        
        this.iconService.createTitle(this.svg, this.pieEL.clientWidth / 2, this.margin / 2 + 5, 
            (jobName ? jobName : "JobPosting") + " --- " + pieLabel);

        this.iconService.createIcon(this.svg, this.pieEL.clientWidth - 38, 20, 'pencil', () => {
            this.dialogService.openPieChartEditor('Edit', tileSerial);
            this.chartService.chartType.next('Pie Chart');
        });

        this.iconService.createIcon(this.svg, this.pieEL.clientWidth - 38, 45, 'download', () => {
            this.chartService.saveJsonFile('Pie Chart', jobName, dataSource, pieLabel);
        });

        const self = this;
        this.iconService.createIcon(this.svg, this.pieEL.clientWidth - 38, 70, 'heart', function() {
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

        this.iconService.createIcon(this.svg, this.pieEL.clientWidth - 36, 95, 'trash', () => {
            this.dialogService.openDeleteConfirmation('Pie Chart', tileSerial);
        });
        
        this.iconService.hoverSVG(this.svg);

        this.radius = Math.min(this.pieEL.clientWidth, this.pieEL.clientHeight) / 2 - this.margin;

        // Define the color scale
        this.color = d3.scaleOrdinal()
            .domain(dataSource.map(d => d.label))
            .range(d3.schemeCategory10);

        // Define the pie function
        var pie = d3.pie<Datum>()
            .value((d: Datum) => d.value)
            .sort(null);

        // Define the arc function
        this.arc = d3.arc()
            .innerRadius(0)
            .outerRadius(this.radius);

        // Bind the data to the pie chart and draw the arcs
        this.g = this.svg.append('g')
            .attr('transform', 'translate(' + this.pieEL.clientWidth / 2 + ',' + this.pieEL.clientHeight / 2 + ')');
        
        var tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        this.g.selectAll('path')
            .data(pie(dataSource))
            .enter()
            .append('path')
            .attr('d', this.arc)
            .attr('fill', (d) => this.color(d.data.label))
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
                bar.style('fill', this.color(d.data.label));
            });

    }

    public updateChart(): void {
        // Update the SVG element size
        this.svg.attr('width', this.pieEL.clientWidth)
            .attr('height', this.pieEL.clientHeight);

        this.svg.select("text.title")
            .attr("x", (this.pieEL.clientWidth / 2))
            .attr("y", this.margin / 2 + 5)

        this.svg.select('foreignObject.pencil')
            .attr('x', this.pieEL.clientWidth - 38)
            .attr('y', 20)

        this.svg.select('foreignObject.download')
            .attr('x', this.pieEL.clientWidth - 38)
            .attr('y', 45)

        this.svg.select('foreignObject.heart')
            .attr('x', this.pieEL.clientWidth - 38)
            .attr('y', 70)

        this.svg.select('foreignObject.trash')
            .attr('x', this.pieEL.clientWidth - 36)
            .attr('y', 95)

        this.radius = Math.min(this.pieEL.clientWidth, this.pieEL.clientHeight) / 2 - this.margin;

        this.arc = d3.arc()
            .innerRadius(0)
            .outerRadius(this.radius);
        
        this.g.attr('transform', 'translate(' + this.pieEL.clientWidth / 2 + ',' + this.pieEL.clientHeight / 2 + ')');

        this.svg.selectAll('path')
            .attr('d', this.arc)
            .attr('fill', (d) => this.color(d.data.label));
    }

}
