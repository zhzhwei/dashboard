import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { MatDialog } from '@angular/material/dialog';

interface Datum {
    label: string;
    value: number;
}

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

    constructor() { }

    private svg: any;
    private margin = 80;
    private pieEl: any;
    private radius: number;
    private color: any;
    private arc: any;
    private g: any;

    public data = [
        { label: 'A', value: 10 },
        { label: 'B', value: 20 },
        { label: 'C', value: 30 },
        { label: 'D', value: 40 },
    ];

    ngOnInit(): void {

    }

    public createChart(data: any): void {
        this.pieEl = document.getElementById('pie');
        // console.log(this.pieEl.clientWidth, this.pieEl.clientHeight);

        // Clear the item's content
        while (this.pieEl.firstChild) {
            this.pieEl.removeChild(this.pieEl.firstChild);
        }

        this.svg = d3.select('#pie')
            .append('svg')
            .attr('width', this.pieEl.clientWidth)
            .attr('height', this.pieEl.clientHeight)

        var g = this.svg.append('g')
            .attr('transform', 'translate(' + (this.margin + 10) + ',' + this.margin + ')');

        this.svg.append('foreignObject')
            .attr('class', 'edit')
            .attr('x', this.pieEl.clientWidth - 50)
            .attr('y', 40)
            .attr('width', 20)
            .attr('height', 20)
            .html('<i class="fas fa-pencil"></i>')
            .on('click', () => {
                // this.openDialog();
            });

        this.svg.append("text")
            .attr("class", "title")
            .attr("x", (this.pieEl.clientWidth / 2))
            .attr("y", this.margin / 2 + 15)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Beruf - Werkzeugmacher");

        this.radius = Math.min(this.pieEl.clientWidth, this.pieEl.clientHeight) / 2 - this.margin;

        // Define the color scale
        this.color = d3.scaleOrdinal()
            .domain(this.data.map(d => d.label))
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

        this.g.selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('d', this.arc)
            .attr('fill', (d) => this.color(d.data.label));
    }

    public updateChart(): void {
        // Update the SVG element size
        this.svg.attr('width', this.pieEl.clientWidth)
            .attr('height', this.pieEl.clientHeight);
        // console.log(this.barEL.clientWidth, this.barEL.clientHeight);

        this.svg.select("text.title")
            .attr("x", (this.pieEl.clientWidth / 2))
            .attr("y", this.margin / 2)

        this.svg.select('foreignObject.edit')
            .attr('x', this.pieEl.clientWidth - 50)
            .attr('y', 20)

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
