import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-star-plot',
    templateUrl: './star-plot.component.html',
    styleUrls: ['./star-plot.component.css']
})
export class StarPlotComponent implements OnInit {

    private data = [
        { axis: "K", value: 5 },
        { axis: "P", value: 3 },
        { axis: "T", value: 4 },
        { axis: "F", value: 2 },
        { axis: "M", value: 4 }
    ];

    private x: any;
    private y: any;
    private radius: number;
    private svg: any;
    private starEL: any;
    private margin = 70;
    
    constructor() { }

    ngOnInit() {
        
    }

    public createChart() {
        this.starEL = document.getElementById('star');
        // Clear the item's content
        while (this.starEL.firstChild) {
            this.starEL.removeChild(this.starEL.firstChild);
        }
        this.svg = d3.select('#star')
            .append('svg')
            .attr('width', this.starEL.clientWidth)
            .attr('height', this.starEL.clientHeight)
            
        var g = this.svg.append('g')
            .attr('transform', 'translate(' + (this.starEL.clientWidth / 2) + ',' + (this.starEL.clientHeight / 2) + ')');

        this.svg.append("text")
            .attr("class", "title")
            .attr("x", (this.starEL.clientWidth / 2))
            .attr("y", this.margin / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Stellenausschreibungen - Fertigkeiten");

        this.x = d3.scaleBand()
            .range([0, 2 * Math.PI])
            .align(0)
            .domain(this.data.map(d => d.axis));
        
        this.radius = Math.min(this.starEL.clientWidth, this.starEL.clientHeight) / 2;
        
        g.append('g')
            .selectAll('g')
            .data(this.data)
            .enter()
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', d => 'rotate(' + ((this.x(d.axis) * 180 / Math.PI) - 90) + ')translate(' + this.radius + ',0)')
            .append('line')
            .attr('x2', -this.radius)
            .style('stroke', '#000')
            .style('stroke-opacity', 1);
        
        g.append('g')
            .selectAll('text')
            .data(this.data)
            .enter()
            .append('text')
            .attr('transform', d => 'rotate(' + ((this.x(d.axis) * 180 / Math.PI) - 90) + ')translate(' + this.radius + ',0)')
            .attr('text-anchor', 'end')
            .attr('dy', '1em')
            .text(d => d.axis);
        
        this.y = d3.scaleLinear()
            .domain([0, 8])
            .range([0, this.radius]);

        let starLine = d3.lineRadial<{x: number, y: number}>()
            .radius(d => d.y)
            .angle(d => d.x)
            .curve(d3.curveLinearClosed);

        g.append('g')
            .selectAll('path')
            .data([this.data])
            .enter()
            .append('path')
            .attr('d', d => starLine(d.map(t => ({ x: this.x(t.axis), y: this.y(t.value) }))))
            .style('fill', '#FE5F55')
            .style('stroke', 'red')
            .style('stroke-width', '2px')
            .style('stroke-opacity', 0.6)
            .style('fill-opacity', 0.6);
    }

    public updateChart(): void {
        // Update the SVG element size
        this.svg.attr('width', this.starEL.clientWidth)
            .attr('height', this.starEL.clientHeight);
        
        this.svg.select('g')
            .attr('transform', 'translate(' + (this.starEL.clientWidth / 2) + ',' + (this.starEL.clientHeight / 2) + ')');

        this.svg.select("text.title")
            .attr("x", (this.starEL.clientWidth / 2))
            .attr("y", this.margin / 2)

        // Redraw the X-axis on the DOM
        // this.radius = Math.min(this.starEL.clientWidth, this.starEL.clientHeight) / 2;
        // this.svg.selectAll('g.x-axis')
        //     .attr('transform', d => 'rotate(' + ((this.x(d.axis) * 180 / Math.PI) - 90) + ')translate(' + this.radius + ',0)')
        //     .attr('x2', -this.radius)
        
        // Update the Y-axis scale range
        // this.y.range([0, this.radius]);
    }
}