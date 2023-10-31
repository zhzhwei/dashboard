import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-stacked-barchart',
    templateUrl: './stackbarchart.component.html',
    styleUrls: ['./stackbarchart.component.css']
})
export class StackedBarChartComponent implements OnInit {

    svg: any;

    margin = 50;
    width = 460 - (this.margin * 2);
    height = 400 - (this.margin * 2);

    public data = [
        { type: "banana", nitrogen: 12, normal: 1, stress: 13 },
        { type: "poacee", nitrogen: 6, normal: 6, stress: 33 },
        { type: "sorgho", nitrogen: 11, normal: 28, stress: 12 },
        { type: "triticum", nitrogen: 19, normal: 6, stress: 1 }
    ];

    ngOnInit(): void {
        this.createSvg();
        this.drawBars(this.data)
    }

    public createSvg(): void {
        this.svg = d3.select("figure#stacked-bar")
            .append("svg")
            .attr("width", this.width + (this.margin * 3))
            .attr("height", this.height + (this.margin * 3))
            .append("g")
            .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
    }

    public drawBars(data): void {
        const groups = ["nitrogen", "normal", "stress"];
        const subgroups = ["banana", "poacee", "sorgho", "triticum"];

        // Create the X-axis band scale.
        var x = d3.scaleBand()
            .domain(subgroups)
            .range([0, this.width])
            .padding(0.2)

        this.svg.append("g")
            .attr("transform", "translate(0," + this.height + ")")
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 60])
            .range([this.height, 0]);
        this.svg.append("g")
            .call(d3.axisLeft(y));

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
            .attr("x", d => x(d.data.type))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("stroke", "grey")
    }
}