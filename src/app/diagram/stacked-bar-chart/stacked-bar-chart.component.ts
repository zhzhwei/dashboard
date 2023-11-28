import * as d3 from 'd3';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StackedBarEditorComponent } from   '../../dialog/stacked-bar-editor/stacked-bar-editor.component';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-stacked-bar-chart',
})

export class StackedBarChartComponent implements OnInit {
    constructor(private dialog: MatDialog, private dialogService: DialogService) { }

    private svg: any;

    private margin = 70;
    private stackedBarEL: any;
    private x: any;
    private y: any;
    private legend: any;
    private legendItems: any;

    public data = [
        { Type: "Kommfähigkeit", Werkzeugmacher: 3, Feinwerkmechaniker: 2 },
        { Type: "Polymechaniker", Werkzeugmacher: 2, Feinwerkmechaniker: 3 },
        { Type: "Teamfähigkeit", Werkzeugmacher: 4, Feinwerkmechaniker: 2 },
        { Type: "Flexibilität", Werkzeugmacher: 1, Feinwerkmechaniker: 3 },
        { Type: 'Motivation', Werkzeugmacher: 3, Feinwerkmechaniker: 1 }
    ];

    ngOnInit(): void {

    }

    openDialog() {
        this.dialog.open(StackedBarEditorComponent, {
            width: '1500px',
            height: '800px',
            backdropClass: "hello",
            autoFocus: false,
            disableClose: true
        });
    }

    public createChart(data): void {
        this.stackedBarEL = document.getElementById('dash-stacked-bar');
        
        // Clear the item's content
        while (this.stackedBarEL.firstChild) {
            this.stackedBarEL.removeChild(this.stackedBarEL.firstChild);
        }
        
        this.svg = d3.select("#dash-stacked-bar")
            .append("svg")
            .attr("width", this.stackedBarEL.clientWidth)
            .attr("height", this.stackedBarEL.clientHeight)

        var g = this.svg.append("g")
            .attr("transform", "translate(" + (this.margin + 10) + "," + this.margin + ")");

        this.svg.append("text")
            .attr("class", "title")
            .attr("x", (this.stackedBarEL.clientWidth / 2))
            .attr("y", this.margin / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Stellenausschreibungen - Fertigkeiten");

        this.svg.append('foreignObject')
            .attr('class', 'pencil')
            .attr('x', this.stackedBarEL.clientWidth - 38)
            .attr('y', 20)
            .attr('width', 20)
            .attr('height', 20)
            .html('<i class="fas fa-pencil"></i>')
            .on('click', () => {
                this.dialogService.openStackedBarChartEditor();
            });

        this.svg.append('foreignObject')
            .attr('class', 'download')
            .attr('x', this.stackedBarEL.clientWidth - 38)
            .attr('y', 45)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-download"></i>')
            .on('click', () => {
                // this.dialogService.openBarChartEditor();
            });
        
        this.svg.append('foreignObject')
            .attr('class', 'heart')
            .attr('x', this.stackedBarEL.clientWidth - 38)
            .attr('y', 70)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-heart"></i>')
            .on('click', () => {
                // this.chartService.saveJsonFile('Bar Chart', jobName, dataSource, titleCount);
            });
        
        this.svg.append('foreignObject')
            .attr('class', 'trash')
            .attr('x', this.stackedBarEL.clientWidth - 36)
            .attr('y', 95)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-trash"></i>')
            .on('click', () => {
                // this.barRemove = true;
                // this.chartService.barRemove.next(this.barRemove);
            });

        const groups = ["Werkzeugmacher", "Feinwerkmechaniker"];
        const legendGroups = ["Feinwerkmechaniker", "Werkzeugmacher"];
        const subgroups = ["Kommfähigkeit", "Polymechaniker", "Teamfähigkeit", "Flexibilität", "Motivation"];

        // // Create the X-axis band scale.
        this.x = d3.scaleBand()
            .domain(subgroups)
            .range([0, this.stackedBarEL.clientWidth - this.margin * 2])
            .padding(0.2)

        // Draw the X-axis on the DOM
        g.append("g")
            .attr('class', 'x-axis')
            .attr("transform", "translate(0," + (this.stackedBarEL.clientHeight - this.margin * 2) + ")")
            .call(d3.axisBottom(this.x).tickSizeOuter(0))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');

        // // Add Y axis
        this.y = d3.scaleLinear()
            .domain([0, 7])
            .range([this.stackedBarEL.clientHeight - this.margin * 2, 0]);

        // Draw the Y-axis on the DOM
        g.append("g")
            .attr('class', 'y-axis')
            .call(d3.axisLeft(this.y));

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(groups)
            .range(['steelblue', 'darkorange'])

        // stack the data per subgroup
        var stackedBarData = d3.stack()
            .keys(groups)
            (data)
        // console.log(stackedBarData);

        // Create and fill the bars.
        g.append("g")
            .selectAll("g")
            .data(stackedBarData)
            .enter()
            .append("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
            .attr("x", d => this.x(d.data.Type))
            .attr("y", d => this.y(d[1]))
            .attr("height", d => this.y(d[0]) - this.y(d[1]))
            .attr("width", this.x.bandwidth())
            .attr("stroke", "grey")
            .on('mouseover', (d, i, nodes) => {
                // Create the tooltip element
                var tooltip = d3.select('#dash-stacked-bar')
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
                    .html(`Type: ${d.data['Type']}<br>Feinwerkmechaniker: ${d.data['Feinwerkmechaniker']}<br>Werkzeugmacher: ${d.data['Werkzeugmacher']}`)
                    .transition()
                    .duration(200)
                    .style('opacity', 1);

                // Add a mousemove event listener to update the position of the tooltip element
                d3.select('body')
                    .on('mousemove', () => {
                        var [x, y] = d3.mouse(nodes[i]);
                        tooltip.style('left', `${x}px`)
                            .style('top', `${y - 40}px`);
                    });
            })
            .on('mouseout', () => {
                // Hide the tooltip element
                d3.select('.tooltip').remove();
            });

        this.legend = g.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${this.stackedBarEL.clientWidth / 4}, 0)`);

        // Create a group element for each legend item
        this.legendItems = this.legend.selectAll(".legend-item")
            .data(legendGroups)
            .enter()
            .append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        // Append a circle element to each group element to represent the legend item
        this.legendItems.append("circle")
            .attr("cx", 5)
            .attr("cy", 5)
            .attr("r", 6)
            .attr("fill", d => color(d));
            // .attr("x", 5)
            // .attr("y", 0)
            // .attr("width", 10)
            // .attr("height", 10)
            // .attr("fill", d => color(d));

        // Append a text element to each group element to represent the legend item
        this.legendItems.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .text(d => d)
            .attr("font-size", "15px")
    }

    public updateChart(): void {
        // Update the SVG element size
        this.svg.attr('width', this.stackedBarEL.clientWidth)
            .attr('height', this.stackedBarEL.clientHeight);

        this.svg.select("text.title")
            .attr("x", (this.stackedBarEL.clientWidth / 2))
            .attr("y", this.margin / 2)
        
        this.svg.select('foreignObject.pencil')
            .attr('x', this.stackedBarEL.clientWidth - 38)
            .attr('y', 20)

        this.svg.select('foreignObject.download')
            .attr('x', this.stackedBarEL.clientWidth - 38)
            .attr('y', 45)

        this.svg.select('foreignObject.heart')
            .attr('x', this.stackedBarEL.clientWidth - 38)
            .attr('y', 70)

        this.svg.select('foreignObject.trash')
            .attr('x', this.stackedBarEL.clientWidth - 36)
            .attr('y', 95)

        // Update the X-axis scale range
        this.x.range([0, this.stackedBarEL.clientWidth - this.margin * 2]);

        // Redraw the X-axis on the DOM
        this.svg.select('g.x-axis')
            .attr('transform', 'translate(0,' + (this.stackedBarEL.clientHeight - this.margin * 2) + ')')
            .call(d3.axisBottom(this.x).tickSizeOuter(0))

        // Update the Y-axis scale range
        this.y.range([this.stackedBarEL.clientHeight - this.margin * 2, 0]);

        // Redraw the Y-axis on the DOM
        this.svg.select('g.y-axis')
            .call(d3.axisLeft(this.y));

        // Redraw the bars on the DOM
        this.svg.selectAll('rect')
            .attr("x", (d: any) => this.x(d.data.Type))
            .attr("y", (d: any) => this.y(d[1]))
            .attr("height", (d: any) => this.y(d[0]) - this.y(d[1]))
            .attr("width", this.x.bandwidth())
            .attr("stroke", "grey");
        
        this.svg.select("g.legend")
            .attr("transform", 'translate(' + (this.stackedBarEL.clientWidth / 4) + ', 0)');
    }

}