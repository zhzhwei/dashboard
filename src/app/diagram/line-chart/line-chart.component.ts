import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { ChartService } from '../../services/chart.service';

import * as d3 from 'd3';
import { setUncaughtExceptionCaptureCallback } from 'process';

@Component({
    selector: 'app-line-chart',
})

export class LineChartComponent implements OnInit {

    constructor(private dialogService: DialogService, private chartService: ChartService) { }

    private svg: any;
    private margin = 70;
    private lineEL: any;
    private x: any;
    private y: any;
    public barRemove = false;

    ngOnInit(): void { }

    public createChart(): void {
        var data = [
            {date: 2014, value: 20},
            {date: 2015, value: 50},
            {date: 2016, value: 30},
            {date: 2017, value: 40},
            {date: 2018, value: 70},
            {date: 2019, value: 60}
        ];

        this.lineEL = document.getElementById('dash-line');
        // console.log(this.lineEL.clientWidth, this.lineEL.clientHeight);

        // Clear the item's content
        while (this.lineEL.firstChild) {
            this.lineEL.removeChild(this.lineEL.firstChild);
        }

        this.svg = d3.select('#dash-line')
            .append('svg')
            .attr('width', this.lineEL.clientWidth)
            .attr('height', this.lineEL.clientHeight);
        
        var g = this.svg.append('g')
            .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
        
        this.svg.append("text")
            .attr("class", "title")
            .attr("x", (this.lineEL.clientWidth / 2))
            .attr("y", this.margin / 2 + 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("JobPosting");
        
        this.svg.append('foreignObject')
            .attr('class', 'pencil')
            .attr('x', this.lineEL.clientWidth - 38)
            .attr('y', 20)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-pencil"></i>')
            .on('click', () => {
                // this.dialogService.openBarChartEditor();
                // this.chartService.chartType.next('Bar Chart');
            });
        
        this.svg.append('foreignObject')
            .attr('class', 'cart')
            .attr('x', this.lineEL.clientWidth - 40)
            .attr('y', 45)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-shopping-cart"></i>')
            .on('click', () => {
                // this.dialogService.openBarChartEditor();
            });
        
        this.svg.append('foreignObject')
            .attr('class', 'heart')
            .attr('x', this.lineEL.clientWidth - 38)
            .attr('y', 70)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-heart"></i>')
            .on('click', () => {
                // this.chartService.saveJsonFile('Bar Chart', jobName, dataSource, titleCount);
            });
        
        this.svg.append('foreignObject')
            .attr('class', 'trash')
            .attr('x', this.lineEL.clientWidth - 36)
            .attr('y', 95)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-trash"></i>')
            .on('click', () => {
                // this.barRemove = true;
                // this.chartService.barRemove.next(this.barRemove);
            });

        
        var parseTime = d3.timeParse("%Y");

        data.forEach(function (d: any) {
            d.date = parseTime(d.date);
            d.value = +d.value;
        });

        this.x = d3.scaleTime().range([0, this.lineEL.clientWidth - this.margin * 2])
            .domain(d3.extent(data, d => d.date));

        this.y = d3.scaleLinear().range([this.lineEL.clientHeight - this.margin * 2, 0])
            .domain([0, d3.max(data, d => d.value)]);  

        g.append("g")
            .attr('transform', 'translate(0,' + (this.lineEL.clientHeight - this.margin * 2) + ')')
            .call(d3.axisBottom(this.x))
            .selectAll("text")
            .style('text-anchor', 'middle');

        g.append("g")
            .call(d3.axisLeft(this.y));
        
        g.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d: any) => this.x(d.date))
            .attr("cy", (d: any) => this.y(d.value))
            .attr("r", 3)
            .attr("fill", 'steelblue');

        var valueline = d3.line()
            .x((d: any) => this.x(d.date))
            .y((d: any) => this.y(d.value));

        g.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline)
            .attr("fill", "none")
            .attr("stroke", "steelblue");

    }

}