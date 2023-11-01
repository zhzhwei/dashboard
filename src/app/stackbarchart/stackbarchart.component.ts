import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-stacked-barchart',
    templateUrl: './stackbarchart.component.html',
    styleUrls: ['./stackbarchart.component.css']
})
export class StackedBarChartComponent implements OnInit {

    private svg: any;

    private margin = 70;
    private barEL: any;
    private x: any;
    private y: any;

    public data = [
        { type: "Gesamt", Werkzeugmacher: 13, Feinwerkmechaniker: 10 },
        { type: "Polymechaniker", Werkzeugmacher: 1, Feinwerkmechaniker: 3 },
        { type: "Teamfähigkeit", Werkzeugmacher: 4, Feinwerkmechaniker: 4 },
        { type: "Flexibilität", Werkzeugmacher: 5, Feinwerkmechaniker: 2 },
        { type: 'Motivation',   Werkzeugmacher: 3,  Feinwerkmechaniker: 1 }
    ];

    ngOnInit(): void {

    }

    public createChart(data): void {
        this.barEL = document.getElementById('stacked');

        this.svg = d3.select("#stacked")
            .append("svg")
            .attr("width", this.barEL.clientWidth)
            .attr("height", this.barEL.clientHeight)

        var g = this.svg.append("g")
            .attr("transform", "translate(" + (this.margin + 10) + "," + this.margin + ")");

        this.svg.append("text")
            .attr("x", (this.barEL.clientWidth / 2))
            .attr("y", this.margin / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Stellenausschreibungen - Fertigkeiten");

        const groups = ["Werkzeugmacher", "Feinwerkmechaniker"];
        const subgroups = ["Gesamt", "Polymechaniker", "Teamfähigkeit", "Flexibilität", "Motivation"];

        // // Create the X-axis band scale.
        this.x = d3.scaleBand()
            .domain(subgroups)
            .range([0, this.barEL.clientWidth - this.margin * 2])
            .padding(0.2)

        // Draw the X-axis on the DOM
        g.append("g")
            .attr('class', 'x-axis')
            .attr("transform", "translate(0," + (this.barEL.clientHeight - this.margin * 2) + ")")
            .call(d3.axisBottom(this.x).tickSizeOuter(0))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');

        // // Add Y axis
        this.y = d3.scaleLinear()
            .domain([0, 24])
            .range([this.barEL.clientHeight - this.margin * 2, 0]);

        // Draw the Y-axis on the DOM
        g.append("g")
            .attr('class', 'y-axis')
            .call(d3.axisLeft(this.y));

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(groups)
            .range(['steelblue', 'darkorange'])

        // stack the data per subgroup
        var stackedData = d3.stack()
            .keys(groups)
            (data)

        // Create and fill the bars.
        g.append("g")
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

    public updateChart(): void {
        // Update the SVG element size
        this.svg.attr('width', this.barEL.clientWidth)
            .attr('height', this.barEL.clientHeight);
        
        // Update the X-axis scale range
        this.x.range([0, this.barEL.clientWidth - this.margin * 2]);

        // Redraw the X-axis on the DOM
        this.svg.select('g.x-axis')
            .attr('transform', 'translate(0,' + (this.barEL.clientHeight - this.margin * 2) + ')')
            .call(d3.axisBottom(this.x).tickSizeOuter(0))

        // Update the Y-axis scale range
        this.y.range([this.barEL.clientHeight - this.margin * 2, 0]);

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