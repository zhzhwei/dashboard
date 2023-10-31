import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-stacked-barchart',
    templateUrl: './stackbarchart.component.html',
    styleUrls: ['./stackbarchart.component.css']
})
export class StackedBarChartComponent implements OnInit {

    private svg: any;

    private margin = 50;
    private barEL: any;
    private x: any;
    private y: any;

    public data = [
        { type: "banana", nitrogen: 13, normal: 8, stress: 4 },
        { type: "poacee", nitrogen: 10, normal: 10, stress: 9 },
        { type: "sorgho", nitrogen: 12, normal: 5, stress: 6 },
        { type: "triticum", nitrogen: 4, normal: 6, stress: 10 }
    ];

    ngOnInit(): void {

    }

    public drawBars(data): void {
        this.barEL = document.getElementById('stacked');

        this.svg = d3.select("#stacked")
            .append("svg")
            .attr("width", this.barEL.clientWidth + (this.margin * 2))
            .attr("height", this.barEL.clientHeight + (this.margin * 2))
            .append("g")
            .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

        const groups = ["nitrogen", "normal", "stress"];
        const subgroups = ["banana", "poacee", "sorgho", "triticum"];

        // Create the X-axis band scale.
        this.x = d3.scaleBand()
            .domain(subgroups)
            .range([0, this.barEL.clientWidth - this.margin * 2])
            .padding(0.2)

        this.svg.append("g")
            .attr('class', 'x-axis')
            .attr("transform", "translate(0," + this.barEL.clientHeight + ")")
            .call(d3.axisBottom(this.x).tickSizeOuter(0));

        // Add Y axis
        this.y = d3.scaleLinear()
            .domain([0, 30])
            .range([this.barEL.clientHeight, 0]);

        this.svg.append("g")
            .attr('class', 'y-axis')
            .call(d3.axisLeft(this.y));

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(groups)
            .range(['#C7EFCF', '#FE5F55', '#EEF5DB', '#F0DDAA'])

        //stack the data per subgroup
        var stackedData = d3.stack()
            .keys(groups)
            (data)

        // Create and fill the bars.
        this.svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", d => this.x(d.data.type))
            .attr("y", d => this.y(d[1]))
            .attr("height", d => this.y(d[0]) - this.y(d[1]))
            .attr("width", this.x.bandwidth())
            .attr("stroke", "grey")
    }

    public updateBars(): void {
        // Update the SVG element size
        this.svg.attr('width', this.barEL.clientWidth + (this.margin * 2))
            .attr('height', this.barEL.clientHeight + (this.margin * 2));

        // Update the X-axis scale range
        this.x.range([0, this.barEL.clientWidth - this.margin * 2]);

        // Redraw the X-axis on the DOM
        this.svg.select('g.x-axis')
            .attr('transform', 'translate(0,' + (this.barEL.clientHeight) + ')')
            .call(d3.axisBottom(this.x).tickSizeOuter(0))

        // Update the Y-axis scale range
        this.y.range([this.barEL.clientHeight, 0]);

        // Redraw the Y-axis on the DOM
        this.svg.select('g.y-axis')
            .call(d3.axisLeft(this.y));

        // Redraw the bars on the DOM
        this.svg.selectAll('rect')
            .attr("x", (d: any) => this.x(d.data.type))
            .attr("y", (d: any) => this.y(d[1]))
            .attr("height", (d: any) => this.y(d[0]) - this.y(d[1]))
            .attr("width", this.x.bandwidth())
            .attr("stroke", "grey");
    }

}