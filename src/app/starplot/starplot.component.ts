import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-starplot',
    templateUrl: './starplot.component.html',
    styleUrls: ['./starplot.component.css']
})
export class StarPlotComponent implements OnInit {

    private data = [
        { axis: "K", value: 5 },
        { axis: "P", value: 3 },
        { axis: "T", value: 4 },
        { axis: "F", value: 2 },
        { axis: "M", value: 4 }
    ];

    private svg: any;
    private starEL: any;
    private margin = 50;

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
            
        var g = this.svg.append('g')
            .attr('transform', 'translate(' + (this.starEL.clientWidth / 2) + ',' + (this.starEL.clientHeight / 2 + 10) + ')');

        let x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0)
            .domain(this.data.map(d => d.axis));
        
        g.append('g')
            .selectAll('g')
            .data(this.data)
            .enter()
            .append('g')
            .attr('transform', d => 'rotate(' + ((x(d.axis) * 180 / Math.PI) - 90) + ')translate(' + radius + ',0)')
            .append('line')
            .attr('x2', -radius)
            .style('stroke', '#000')
            .style('stroke-opacity', 1);
        
        g.append('g')
            .selectAll('text')
            .data(this.data)
            .enter()
            .append('text')
            .attr('transform', d => 'rotate(' + ((x(d.axis) * 180 / Math.PI) - 90) + ')translate(' + radius + ',0)')
            .attr('text-anchor', 'end')
            .attr('dy', '1em')
            .text(d => d.axis);
        
        let y = d3.scaleLinear()
            .domain([0, 8])
            .range([0, radius]);

        let starLine = d3.lineRadial<{x: number, y: number}>()
            .radius(d => d.y)
            .angle(d => d.x)
            .curve(d3.curveLinearClosed);

        g.append('g')
            .selectAll('path')
            .data([this.data])
            .enter()
            .append('path')
            .attr('d', d => starLine(d.map(t => ({ x: x(t.axis), y: y(t.value) }))))
            .style('fill', '#FE5F55')
            .style('stroke', 'red')
            .style('stroke-width', '2px')
            .style('stroke-opacity', 0.6)
            .style('fill-opacity', 0.6);
    }
}