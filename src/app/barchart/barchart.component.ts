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
    private margin = 80;
    private barEL: any;
    private x: any;
    private y: any;

    public data = [
        { 'Fertigkeit': 'Gesamt', 'Häufigkeit': '19' },
        { 'Fertigkeit': 'Polymechaniker', 'Häufigkeit': '16' },
        { 'Fertigkeit': 'Teamfähigkeit', 'Häufigkeit': '8'  },
        { 'Fertigkeit': 'Flexibilität', 'Häufigkeit': '5'  },
        { 'Fertigkeit': 'Motivation', 'Häufigkeit': '3' }
    ];

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
            .domain(data.map(d => d.Fertigkeit))
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
            .domain([0, 20])
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
            .attr('x', (d: any) => this.x(d.Fertigkeit))
            .attr('y', (d: any) => this.y(d.Häufigkeit))
            .attr('width', this.x.bandwidth())
            .attr('height', (d: any) => this.barEL.clientHeight - this.margin * 2 - this.y(d.Häufigkeit))
            .attr('fill', 'steelblue')
            .on('mouseover', (d, i, nodes) => {
                // Get the current bar element
                const bar = d3.select(nodes[i]);

                // Create the tooltip element
                const tooltip = d3.select('body')
                    .append('div')
                    .attr('class', 'tooltip')
                    .style('position', 'absolute')
                    .style('background-color', 'white')
                    .style('border', 'solid')
                    .style('border-width', '1px')
                    .style('border-radius', '5px')
                    .style('padding', '10px')
                    .style('opacity', 0)
                    .text(`${d.Fertigkeit}: ${d.Häufigkeit}`);
                
                // Show the tooltip element
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);

                // Change the color of the bar
                bar.style('fill', 'orange');

                // Add a mousemove event listener to update the position of the tooltip element
                d3.select('body')
                    .on('mousemove', () => {
                        const [x, y] = d3.mouse(nodes[i]);
                        // console.log(x, y);
                        tooltip.style('left', `${x + 800}px`)
                            .style('top', `${y + 80}px`);
                    });
            })
            .on('mouseout', (d, i, nodes) => {
                // Get the current bar element
                const bar = d3.select(nodes[i]);

                // Hide the tooltip element
                d3.select('.tooltip').remove();

                // Change the color of the bar back to the original color
                bar.style('fill', 'steelblue');
            });
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
            .attr('x', (d: any) => this.x(d.Fertigkeit))
            .attr('y', (d: any) => this.y(d.Häufigkeit))
            .attr('width', this.x.bandwidth())
            .attr('height', (d: any) => this.barEL.clientHeight - this.margin * 2 - this.y(d.Häufigkeit));
    }

}