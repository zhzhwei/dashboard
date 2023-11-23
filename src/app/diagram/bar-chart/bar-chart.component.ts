import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DialogService } from '../../services/dialog.service';
import { ChartService } from 'src/app/services/chart.service';

@Component({
    selector: 'app-bar-chart',
})

export class BarChartComponent implements OnInit {

    constructor(private dialogService: DialogService, private chartService: ChartService) { }

    private svg: any;
    private margin = 70;
    private barEL: any;
    private x: any;
    private y: any;
    public barRemove = false;

    ngOnInit(): void { }

    public createChart(jobName: string, dataSource: any[], titleCount: any): void {
        this.barEL = document.getElementById('dash-bar');
        // console.log(this.barEL.clientWidth, this.barEL.clientHeight);
        
        // Clear the item's content
        while (this.barEL.firstChild) {
            this.barEL.removeChild(this.barEL.firstChild);
        }

        this.svg = d3.select('#dash-bar')
            .append('svg')
            .attr('width', this.barEL.clientWidth)
            .attr('height', this.barEL.clientHeight)

        var g = this.svg.append('g')
            .attr('transform', 'translate(' + (this.margin + 10) + ',' + this.margin + ')');

        this.svg.append("text")
            .attr("class", "title")
            .attr("x", (this.barEL.clientWidth / 2))
            .attr("y", this.margin / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text(`${jobName}` + " --- " + `${titleCount}` + " Stellenangebote");

        this.svg.append('foreignObject')
            .attr('class', 'pencil')
            .attr('x', this.barEL.clientWidth - 38)
            .attr('y', 20)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-pencil"></i>')
            .on('click', () => {
                this.dialogService.openBarChartEditor();
                this.chartService.chartType.next('Bar Chart');
            });

        this.svg.append('foreignObject')
            .attr('class', 'cart')
            .attr('x', this.barEL.clientWidth - 40)
            .attr('y', 45)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-shopping-cart"></i>')
            .on('click', () => {
                // this.dialogService.openBarChartEditor();
            });
        
        this.svg.append('foreignObject')
            .attr('class', 'heart')
            .attr('x', this.barEL.clientWidth - 38)
            .attr('y', 70)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-heart"></i>')
            .on('click', () => {
                this.chartService.saveJsonFile('Bar Chart', jobName, dataSource, titleCount);
            });
        
        this.svg.append('foreignObject')
            .attr('class', 'trash')
            .attr('x', this.barEL.clientWidth - 36)
            .attr('y', 95)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-trash"></i>')
            .on('click', () => {
                this.barRemove = true;
                this.chartService.barRemove.next(this.barRemove);
            });

        // Create the X-axis band scale
        this.x = d3.scaleBand()
            .range([0, this.barEL.clientWidth - this.margin * 2])
            .domain(dataSource.map(d => d.skill))
            .padding(0.2);

        // Draw the X-axis on the DOM
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + (this.barEL.clientHeight - this.margin * 2) + ')')
            .call(d3.axisBottom(this.x).tickSizeOuter(0))
            .selectAll('text')
            // .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'middle');

        // Create the Y-axis band scale
        var maxSkillCount = d3.max(dataSource, (d: any) => d.skillCount);
        this.y = d3.scaleLinear()
            .domain([0, maxSkillCount + 1]) 
            .range([this.barEL.clientHeight - this.margin * 2, 0]);

        // Draw the Y-axis on the DOM
        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(this.y))
        
        // Create and fill the bars
        g.selectAll('bars')
            .data(dataSource)
            .enter()
            .append('rect')
            .attr('x', (d: any) => this.x(d.skill))
            .attr('y', (d: any) => this.y(d.skillCount))
            .attr('width', this.x.bandwidth())
            .attr('height', (d: any) => this.barEL.clientHeight - this.margin * 2 - this.y(d.skillCount))
            .attr('fill', 'steelblue')
            .on('mouseover', (d, i, nodes) => {
                // Get the current bar element
                var bar = d3.select(nodes[i]);

                // Create the tooltip element
                var tooltip = d3.select('#dash-bar')
                    .append('div')
                    .attr('class', 'tooltip')
                    .style('position', 'absolute')
                    .style('background-color', 'white')
                    .style('border', 'solid')
                    .style('border-width', '1px')
                    .style('border-radius', '5px')
                    .style('padding', '10px')
                    .style('opacity', 0);

                // Show the tooltip element
                d3.select('.tooltip')
                    // .text(`${d.skill}: ${d.skillCount}`)
                    .html(`Fertigkeit: ${d.skill} <br> Häufigkeit: ${d.skillCount}`)
                    .transition()
                    .duration(200)
                    .style('opacity', 1);

                // Change the color of the bar
                bar.style('fill', 'orange');

                // Add a mousemove event listener to update the position of the tooltip element
                d3.select('body')
                    .on('mousemove', () => {
                        var [x, y] = d3.mouse(nodes[i]);
                        // console.log(x, y);
                        tooltip.style('left', `${x + 30}px`)
                            .style('top', `${y}px`);
                    });
            })
            .on('mouseout', (d, i, nodes) => {
                // Get the current bar element
                var bar = d3.select(nodes[i]);

                // Hide the tooltip element
                d3.select('.tooltip').remove();

                // Change the color of the bar back to the original color
                bar.style('fill', 'steelblue');
            });

    }

    public updateChart(): void {
        // Update the SVG element size
        this.svg.attr('width', this.barEL.clientWidth)
            .attr('height', this.barEL.clientHeight);
        // console.log(this.barEL.clientWidth, this.barEL.clientHeight);

        this.svg.select("text.title")
            .attr("x", (this.barEL.clientWidth / 2))
            .attr("y", this.margin / 2)

        this.svg.select('foreignObject.pencil')
            .attr('x', this.barEL.clientWidth - 38)
            .attr('y', 20)

        this.svg.select('foreignObject.cart')
            .attr('x', this.barEL.clientWidth - 40)
            .attr('y', 45)

        this.svg.select('foreignObject.heart')
            .attr('x', this.barEL.clientWidth - 38)
            .attr('y', 70)

        this.svg.select('foreignObject.trash')
            .attr('x', this.barEL.clientWidth - 36)
            .attr('y', 95)
            
        // Update the X-axis scale range
        this.x.range([0, this.barEL.clientWidth - this.margin * 2]);

        // Redraw the X-axis on the DOM
        this.svg.select('g.x-axis')
            .attr('transform', 'translate(0,' + (this.barEL.clientHeight - this.margin * 2) + ')')
            .call(d3.axisBottom(this.x).tickSizeOuter(0))
            .selectAll('text')
            // .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'middle');

        // Update the Y-axis scale range
        this.y.range([this.barEL.clientHeight - this.margin * 2, 0]);

        // Redraw the Y-axis on the DOM
        this.svg.select('g.y-axis')
            .call(d3.axisLeft(this.y));

        // Redraw the bars on the DOM
        this.svg.selectAll('rect')
            .attr('x', (d: any) => this.x(d.skill))
            .attr('y', (d: any) => this.y(d.skillCount))
            .attr('width', this.x.bandwidth())
            .attr('height', (d: any) => this.barEL.clientHeight - this.margin * 2 - this.y(d.skillCount));
    }

}