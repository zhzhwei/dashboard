import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-doughnut',
})
export class DoughnutComponent implements OnInit {

    constructor(private dialog: MatDialog) { }

    private svg: any;
    private margin = 80;
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

        this.donutEl = document.getElementById('doughnut');
        // console.log(this.donutEl.clientWidth, this.donutEl.clientHeight);

        // Clear the item's content
        while (this.donutEl.firstChild) {
            this.donutEl.removeChild(this.donutEl.firstChild);
        }

        this.svg = d3.select('#doughnut')
            .append('svg')
            .attr('width', this.donutEl.clientWidth)
            .attr('height', this.donutEl.clientHeight)

        this.svg.append('foreignObject')
            .attr('class', 'edit')
            .attr('x', this.donutEl.clientWidth - 50)
            .attr('y', 40)
            .attr('width', 20)
            .attr('height', 20)
            .html('<i class="fas fa-pencil"></i>')
            .on('click', () => {
                // this.openDialog();
            });

        this.svg.append("text")
            .attr("class", "title")
            .attr("x", (this.donutEl.clientWidth / 2))
            .attr("y", this.margin / 2 + 15)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Beruf - Stellenausschreibungen");

        this.outerRadius = Math.min(this.donutEl.clientWidth - this.margin * 2, this.donutEl.clientHeight - this.margin * 2) / 2;
        this.innerRadius1 = this.outerRadius - 50; // adjust this value to change the thickness of the doughnut
        this.innerRadius2 = this.outerRadius - 100;

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
            .attr("y", this.margin / 2)

        this.svg.select('foreignObject.edit')
            .attr('x', this.donutEl.clientWidth - 50)
            .attr('y', 20)

        this.outerRadius = Math.min(this.donutEl.clientWidth - this.margin * 2, this.donutEl.clientHeight - this.margin * 2) / 2;
        this.innerRadius1 = this.outerRadius - 50; // adjust this value to change the thickness of the doughnut
        this.innerRadius2 = this.outerRadius - 100;

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
