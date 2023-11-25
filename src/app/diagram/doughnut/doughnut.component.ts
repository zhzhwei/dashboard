import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-doughnut',
})
export class DoughnutComponent implements OnInit {

    constructor(private dialog: MatDialog) { }

    private svg: any;
    private margin = 70;
    private donutEl: any;
    private color: any;
    private outerRadius: number;

    private g: any;
    private innerRadius1: number;
    private innerRadius2: number;
    private arc1: any;
    private arc2: any;

    public data = [
        { Type: "Kommfähigkeit", Werkzeugmacher: 3, Feinwerkmechaniker: 2 },
        { Type: "Polymechaniker", Werkzeugmacher: 2, Feinwerkmechaniker: 3 },
        { Type: "Teamfähigkeit", Werkzeugmacher: 4, Feinwerkmechaniker: 2 },
        { Type: "Flexibilität", Werkzeugmacher: 1, Feinwerkmechaniker: 3 },
        { Type: 'Motivation', Werkzeugmacher: 3, Feinwerkmechaniker: 1 }
    ];

    ngOnInit(): void {

    }

    public createChart(data: any): void {

        this.donutEl = document.getElementById('dash-doughnut');
        // console.log(this.donutEl.clientWidth, this.donutEl.clientHeight);

        // Clear the item's content
        while (this.donutEl.firstChild) {
            this.donutEl.removeChild(this.donutEl.firstChild);
        }

        this.svg = d3.select('#dash-doughnut')
            .append('svg')
            .attr('width', this.donutEl.clientWidth)
            .attr('height', this.donutEl.clientHeight)

        this.svg.append("text")
            .attr("class", "title")
            .attr("x", (this.donutEl.clientWidth / 2))
            .attr("y", this.margin / 2 + 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Beruf - Stellenausschreibungen");

            this.svg.append('foreignObject')
            .attr('class', 'pencil')
            .attr('x', this.donutEl.clientWidth - 38)
            .attr('y', 20)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-pencil"></i>')
            .on('click', () => {
                // this.dialogService.openPieChartEditor();
                // this.chartService.chartType.next('Pie Chart');
            });

        this.svg.append('foreignObject')
            .attr('class', 'cart')
            .attr('x', this.donutEl.clientWidth - 40)
            .attr('y', 45)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-shopping-cart"></i>')
            .on('click', () => {
                // this.dialogService.openPieChartEditor();
            });
        
        this.svg.append('foreignObject')
            .attr('class', 'heart')
            .attr('x', this.donutEl.clientWidth - 38)
            .attr('y', 70)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-heart"></i>')
            .on('click', () => {
                // this.chartService.saveJsonFile('Pie Chart', jobName, dataSource, pieLabel);
            });
        
        this.svg.append('foreignObject')
            .attr('class', 'trash')
            .attr('x', this.donutEl.clientWidth - 36)
            .attr('y', 95)
            .attr('width', 25)
            .attr('height', 25)
            .html('<i class="fas fa-trash"></i>')
            .on('click', () => {
                // this.pieRemove = true;
                // this.chartService.pieRemove.next(this.pieRemove);
            });


        this.outerRadius = Math.min(this.donutEl.clientWidth, this.donutEl.clientHeight) / 2 - this.margin;
        this.innerRadius1 = this.outerRadius - 30;
        this.innerRadius2 = this.outerRadius - 60;

        // Define the color scale
        this.color = d3.scaleOrdinal(d3.schemeCategory10);

        // Define the pie function
        var pie = d3.pie<any>()
            .sort(null);

        // Define the arc function
        this.arc1 = d3.arc()
            .innerRadius(this.innerRadius1)
            .outerRadius(this.outerRadius);

        this.arc2 = d3.arc()
            .innerRadius(this.innerRadius2)
            .outerRadius(this.innerRadius1);
            
        // Bind the data to the doughnut and draw the arcs
        this.g = this.svg.append('g')
            .attr('transform', 'translate(' + this.donutEl.clientWidth / 2 + ',' + this.donutEl.clientHeight / 2 + ')');
        
        this.g.selectAll('arc1')
            .data(pie(data.map((d: any) => d.Werkzeugmacher)))
            .enter()
            .append('path')
            .attr('d', this.arc1)
            .attr('class', 'arc1')
            .style('fill', (d: any, i: number) => this.color(i.toString()));
        
        this.g.selectAll('arc2')
            .data(pie(data.map((d: any) => d.Feinwerkmechaniker)))
            .enter()
            .append('path')
            .attr('class', 'arc2')
            .attr('d', this.arc2)
            .style('fill', (d: any, i: number) => this.color(i.toString()));
    }

    public updateChart(): void {
        // Update the SVG element size
        this.svg.attr('width', this.donutEl.clientWidth)
            .attr('height', this.donutEl.clientHeight);
        // console.log(this.barEL.clientWidth, this.barEL.clientHeight);

        this.svg.select("text.title")
            .attr("x", (this.donutEl.clientWidth / 2))
            .attr("y", this.margin / 2 + 2)

            this.svg.select('foreignObject.pencil')
            .attr('x', this.donutEl.clientWidth - 38)
            .attr('y', 20)

        this.svg.select('foreignObject.cart')
            .attr('x', this.donutEl.clientWidth - 40)
            .attr('y', 45)

        this.svg.select('foreignObject.heart')
            .attr('x', this.donutEl.clientWidth - 38)
            .attr('y', 70)

        this.svg.select('foreignObject.trash')
            .attr('x', this.donutEl.clientWidth - 36)
            .attr('y', 95)


        this.outerRadius = Math.min(this.donutEl.clientWidth, this.donutEl.clientHeight) / 2 - this.margin;
        this.innerRadius1 = this.outerRadius - 30;
        this.innerRadius2 = this.outerRadius - 60;

        this.arc1 = d3.arc()
            .innerRadius(this.innerRadius1)
            .outerRadius(this.outerRadius);
        
        this.arc2 = d3.arc()
            .innerRadius(this.innerRadius2)
            .outerRadius(this.innerRadius1);

        this.g.attr('transform', 'translate(' + this.donutEl.clientWidth / 2 + ',' + this.donutEl.clientHeight / 2 + ')');

        this.svg.selectAll('path.arc1')
            .attr('d', this.arc1)
            .style('fill', (d: any, i: number) => this.color(i.toString()));
        
        this.svg.selectAll('path.arc2')
            .attr('d', this.arc2)
            .style('fill', (d: any, i: number) => this.color(i.toString()));
    }

}
