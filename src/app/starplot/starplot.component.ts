import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-starplot',
    templateUrl: './starplot.component.html',
    styleUrls: ['./starplot.component.css']
})
export class StarPlotComponent implements OnInit {

    private data = [
        { axis: "A", value: 0.6 },
        { axis: "B", value: 0.5 },
        { axis: "C", value: 0.8 },
        { axis: "D", value: 0.7 },
        { axis: "E", value: 0.6 }
    ];

    private svg: any;
    private starEL: any;

    constructor() { }

    ngOnInit() {
        this.createChart();
    }

    createChart() {
        this.starEL = document.getElementById('star');
        let radius = Math.min(this.starEL.clientWidth, this.starEL.clientHeight) / 2;

        this.svg = d3.select('#star')
            .append('svg')
            .attr('width', this.starEL.clientWidth)
            .attr('height', this.starEL.clientHeight)
            .append('g')
            .attr('transform', 'translate(' + (this.starEL.clientWidth / 2) + ',' + (this.starEL.clientHeight / 2 + 20) + ')');

        let radarLine = d3.lineRadial<{x: number, y: number}>()
            .radius(d => d.y)
            .angle(d => d.x);
        
        let y = d3.scaleLinear()
            .domain([0, 1])
            .range([0, radius]);

        let x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0)
            .domain(this.data.map(d => d.axis));
        
        this.svg.append('g')
            .selectAll('g')
            .data(this.data)
            .enter()
            .append('g')
            .attr('transform', d => 'rotate(' + ((x(d.axis) * 180 / Math.PI) - 90) + ')translate(' + radius + ',0)')
            .append('line')
            .attr('x2', -radius)
            .style('stroke', '#000')
            .style('stroke-opacity', 0.2);
            
        this.svg.append('g')
            .selectAll('text')
            .data(this.data)
            .enter()
            .append('text')
            .attr('transform', d => 'rotate(' + ((x(d.axis) * 180 / Math.PI) - 90) + ')translate(' + radius + ',0)')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.4em')
            .text(d => d.axis);
        
        this.svg.append('g')
            .selectAll('path')
            .data([this.data])
            .enter()
            .append('path')
            .attr('d', d => radarLine(d.map(t => ({ x: x(t.axis), y: y(t.value) }))))
            .style('fill', '#1f77b4')
            .style('fill-opacity', 0.6);
    }
}