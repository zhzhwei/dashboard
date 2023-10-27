import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-barchart',
    templateUrl: './barchart.component.html',
    styleUrls: ['./barchart.component.css'],
})

export class BarChartComponent implements OnInit {

    constructor() { }

    private svg: any;
    private margin = 50;
    private barEL: any;
    private x: any;
    private y: any;

    ngOnInit(): void {

    }

    public drawBars(data: any[]): void {
        this.barEL = document.getElementById('bar');
        // console.log(this.barEL.clientWidth, this.barEL.clientHeight);

        this.svg = d3.select('#bar')
            .append('svg')
            .attr('width', this.barEL.clientWidth)
            .attr('height', this.barEL.clientWidth)
        
        var g = this.svg.append('g') 
            .attr('transform', 'translate(' + (this.margin + 20) + ',' + this.margin + ')');

        // Create the X-axis band scale
        this.x = d3.scaleBand()
            .range([0, this.barEL.clientWidth - this.margin * 2])
            .domain(data.map(d => d.Framework))
            .padding(0.2);

        // Draw the X-axis on the DOM
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + (this.barEL.clientHeight - this.margin * 2) + ')')
            .call(d3.axisBottom(this.x))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');

        // Create the Y-axis band scale
        this.y = d3.scaleLinear()
            .domain([0, 200000])
            .range([this.barEL.clientHeight - this.margin * 2, 0]);

        // Draw the Y-axis on the DOM
        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(this.y))

        // Create and fill the bars
        g.selectAll('bars')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d: any) => this.x(d.Framework))
            .attr('y', (d: any) => this.y(d.Stars))
            .attr('width', this.x.bandwidth())
            .attr('height', (d: any) => this.barEL.clientHeight - this.margin * 2 - this.y(d.Stars))
            .attr('fill', 'steelblue')
    }

    public updateBars(): void {
        // Update the SVG element size
        this.svg.attr('width', this.barEL.clientWidth)
            .attr('height', this.barEL.clientHeight);
        // console.log(this.barEL.clientWidth, this.barEL.clientHeight);

        // Update the X-axis scale range
        this.x.range([0, this.barEL.clientWidth - this.margin * 2]);

        // Redraw the X-axis on the DOM
        this.svg.select('g.x-axis')
            .attr('transform', 'translate(0,' + (this.barEL.clientHeight - this.margin * 2) + ')')
            .call(d3.axisBottom(this.x))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');

        // Update the Y-axis scale range
        this.y.range([this.barEL.clientHeight - this.margin * 2, 0]);

        // Redraw the Y-axis on the DOM
        this.svg.select('g.y-axis')
            .call(d3.axisLeft(this.y));

        // Redraw the bars on the DOM
        this.svg.selectAll('rect')
            .attr('x', (d: any) => this.x(d.Framework))
            .attr('y', (d: any) => this.y(d.Stars))
            .attr('width', this.x.bandwidth())
            .attr('height', (d: any) => this.barEL.clientHeight - this.margin * 2 - this.y(d.Stars));
    }

}