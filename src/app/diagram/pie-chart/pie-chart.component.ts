import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../services/dialog.service';
import { ChartService } from '../../services/chart.service';
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
    private pieEl: any;
    private radius: number;
    private color: any;
    private arc: any;
    private g: any;
    public pieRemove = false;

    constructor(private dialogService: DialogService, private chartService: ChartService) { }

    ngOnInit(): void {

    }

    public createChart(dataSource: any, pieLabel: string): void {
        this.pieEl = document.getElementById('dash-pie');
        // console.log(this.pieEl.clientWidth, this.pieEl.clientHeight);

        // Clear the item's content
        while (this.pieEl.firstChild) {
            this.pieEl.removeChild(this.pieEl.firstChild);
        }

        this.svg = d3.select('#dash-pie')
            .append('svg')
            .attr('width', this.pieEl.clientWidth)
            .attr('height', this.pieEl.clientHeight)
        
        this.svg.append("text")
            .attr("class", "title")
            .attr("x", (this.pieEl.clientWidth / 2))
            .attr("y", this.margin / 2 + 8)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("JobPosting --- " + pieLabel);

        this.svg.append('foreignObject')
            .attr('class', 'pencil')
            .attr('x', this.pieEl.clientWidth - 38)
            .attr('y', 20)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-pencil"></i>')
            .on('click', () => {
                this.dialogService.openPieChartEditor();
                this.chartService.chartType.next('Pie Chart');
            });

        this.svg.append('foreignObject')
            .attr('class', 'cart')
            .attr('x', this.pieEl.clientWidth - 40)
            .attr('y', 45)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-shopping-cart"></i>')
            .on('click', () => {
                // this.dialogService.openPieChartEditor();
            });
        
        this.svg.append('foreignObject')
            .attr('class', 'heart')
            .attr('x', this.pieEl.clientWidth - 38)
            .attr('y', 70)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-heart"></i>')
            .on('click', () => {
                // this.chartService.saveJsonFile(this.chartType, dataSource);
            });
        
        this.svg.append('foreignObject')
            .attr('class', 'trash')
            .attr('x', this.pieEl.clientWidth - 36)
            .attr('y', 95)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-trash"></i>')
            .on('click', () => {
                this.pieRemove = true;
                this.chartService.pieRemove.next(this.pieRemove);
            });

        this.radius = Math.min(this.pieEl.clientWidth, this.pieEl.clientHeight) / 2 - this.margin;

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
            .attr('transform', 'translate(' + this.pieEl.clientWidth / 2 + ',' + this.pieEl.clientHeight / 2 + ')');
        
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
                var tooltip = d3.select('#dash-pie')
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
        this.svg.attr('width', this.pieEl.clientWidth)
            .attr('height', this.pieEl.clientHeight);

        this.svg.select("text.title")
            .attr("x", (this.pieEl.clientWidth / 2))
            .attr("y", this.margin / 2 + 8)

        this.svg.select('foreignObject.pencil')
            .attr('x', this.pieEl.clientWidth - 38)
            .attr('y', 20)

        this.svg.select('foreignObject.cart')
            .attr('x', this.pieEl.clientWidth - 40)
            .attr('y', 45)

        this.svg.select('foreignObject.heart')
            .attr('x', this.pieEl.clientWidth - 38)
            .attr('y', 70)

        this.svg.select('foreignObject.trash')
            .attr('x', this.pieEl.clientWidth - 36)
            .attr('y', 95)

        this.radius = Math.min(this.pieEl.clientWidth, this.pieEl.clientHeight) / 2 - this.margin;

        this.arc = d3.arc()
            .innerRadius(0)
            .outerRadius(this.radius);
        
        this.g.attr('transform', 'translate(' + this.pieEl.clientWidth / 2 + ',' + this.pieEl.clientHeight / 2 + ')');

        this.svg.selectAll('path')
            .attr('d', this.arc)
            .attr('fill', (d) => this.color(d.data.label));
    }

}
