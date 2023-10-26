import { Component, OnInit } from '@angular/core';
import { GridStack } from 'gridstack';
import * as d3 from 'd3';
import 'gridstack/dist/h5/gridstack-dd-native';

@Component({
    selector: 'app-gridstack',
    templateUrl: './gridstack.component.html',
    styleUrls: ['./gridstack.component.css']
})
export class GridStackComponent implements OnInit {

    constructor() { }

    private grid: GridStack;
    private serializedData: any[] = []
    private svg: any;
    private margin = 50;
    private contEl: any;
    private itemEl: any;
    private barEL: any;
    private x: any;
    private y: any;

    private data = [
        { 'Framework': 'Vue', 'Stars': '166443', 'Released': '2014' },
        { 'Framework': 'React', 'Stars': '150793', 'Released': '2013' },
        { 'Framework': 'Angular', 'Stars': '62342', 'Released': '2016' },
        { 'Framework': 'Backbone', 'Stars': '27647', 'Released': '2010' },
        { 'Framework': 'Ember', 'Stars': '21471', 'Released': '2011' },
    ];

    ngOnInit(): void {
        const options = {
            margin: 5,
            column: 12,
            disableOneColumnMode: true,
            acceptWidgets: true,
            removable: '#trash',
            removeTimeout: 100
        };

        GridStack.setupDragIn('.newWidget', { appendTo: 'body', helper: 'clone' });

        this.grid = GridStack.init(options);

        this.serializedData = [
            { x: 0, y: 0, w: 2, h: 2, name: 'star plot' },
            { x: 2, y: 0, w: 2, h: 2, name: 'scatter plot' },
            { x: 4, y: 0, w: 4, h: 4, name: 'bar chart' },
            { x: 8, y: 0, w: 4, h: 2, name: 'box plot' },
            { x: 0, y: 2, w: 4, h: 2, name: 'pie chart' },
            { x: 8, y: 2, w: 4, h: 2, name: 'line chart' },
        ];

        this.grid.load(this.serializedData);

        // Load the serialized data into the grid
        this.serializedData.forEach(item => {
            var itemIndex = this.serializedData.findIndex(item => item.name === 'bar chart');
            this.itemEl = this.grid.getGridItems()[itemIndex];
            this.contEl = this.itemEl.querySelector('.grid-stack-item-content');
            this.contEl.setAttribute('id', 'bar');
        });
        this.drawBars(this.data);
    }

    ngAfterViewInit(): void {
        // Create a new ResizeObserver
        const resizeObserver = new ResizeObserver(entries => {
            // Update the SVG element size
            this.svg.attr('width', this.barEL.clientWidth)
                .attr('height', this.barEL.clientHeight);
            console.log(this.svg.attr('width'), this.svg.attr('height'));
            
            // Update the X-axis scale range
            this.x.range([0, this.barEL.clientWidth - this.margin * 2]);

            // Redraw the X-axis on the DOM
            this.svg.select('g.x-axis')
                .attr('transform', 'translate(0,' + (this.barEL.clientHeight - this.margin * 2) + ')')
                .call(d3.axisBottom(this.x))
                .selectAll('text')
                .attr('transform', 'translate(-10,0)rotate(-45)')
                .style('text-anchor', 'end');

            // Update the Y-axis scale range
            this.y.range([this.barEL.clientHeight - this.margin * 2, 0]);

            // Redraw the Y-axis on the DOM
            this.svg.select('g.y-axis')
                .call(d3.axisLeft(this.y));

            // Redraw the bars on the DOM
            this.svg.selectAll('rect')
                .attr('x', (d: any) => this.x(d.Framework))
                .attr('y', (d: any) => this.y(d.Stars))
                .attr('width', this.x.bandwidth())
                .attr('height', (d: any) => this.barEL.clientHeight - this.margin * 2 - this.y(d.Stars));
        });

        // Observe the element for size changes
        resizeObserver.observe(this.itemEl);
    }

    private drawBars(data: any[]): void {
        this.barEL = document.getElementById('bar');
        console.log(this.barEL.clientWidth, this.barEL.clientHeight);
        this.svg = d3.select('#bar')
            .append('svg')
            .attr('width', this.barEL.clientWidth)
            .attr('height', this.barEL.clientWidth)
            // .append('g')
            .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
        console.log(this.svg.attr('width'), this.svg.attr('height'));
        // console.log(this.svg.attr('g.width'), this.svg.attr('g.height'));
        
        // Create the X-axis band scale
        this.x = d3.scaleBand()
            .range([0, this.barEL.clientWidth - this.margin * 2])
            .domain(data.map(d => d.Framework))
            .padding(0.2);

        // Draw the X-axis on the DOM
        this.svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + (this.barEL.clientHeight - this.margin * 2) + ')')
            .call(d3.axisBottom(this.x))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');

        // Create the Y-axis band scale
        this.y = d3.scaleLinear()
            .domain([0, 180000])
            .range([this.barEL.clientHeight - this.margin * 2, 0]);

        // Draw the Y-axis on the DOM
        this.svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(this.y));

        // Create and fill the bars
        this.svg.selectAll('bars')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d: any) => this.x(d.Framework))
            .attr('y', (d: any) => this.y(d.Stars))
            .attr('width', this.x.bandwidth())
            .attr('height', (d: any) => this.barEL.clientHeight - this.margin * 2 - this.y(d.Stars))
            .attr('fill', 'steelblue')
    }
}