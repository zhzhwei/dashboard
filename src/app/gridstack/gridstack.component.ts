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
    private grid: GridStack;
    private serializedData: any[] = []
    private svg: any;
    private margin = 50;

    private data = [
        { "Framework": "Vue", "Stars": "166443", "Released": "2014" },
        { "Framework": "React", "Stars": "150793", "Released": "2013" },
        { "Framework": "Angular", "Stars": "62342", "Released": "2016" },
        { "Framework": "Backbone", "Stars": "27647", "Released": "2010" },
        { "Framework": "Ember", "Stars": "21471", "Released": "2011" },
    ];

    constructor() { }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        const options = {
            margin: 5,
            column: 12,
            disableOneColumnMode: true,
            acceptWidgets: true,
            removable: '#trash',
            removeTimeout: 100,
            // resizable: {
            //     handles: 'e, n, w, s'
            // }
        };

        GridStack.setupDragIn('.newWidget', { appendTo: 'body', helper: 'clone' });

        const grids = GridStack.initAll(options);
        this.grid = grids[0];

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
            const itemIndex = this.serializedData.findIndex(item => item.name === 'bar chart');
            const itemEl = this.grid.getGridItems()[itemIndex];
            // console.log(itemEl);

            // Add the id attribute to the grid-stack-item-content element
            const contEl = itemEl.querySelector('.grid-stack-item-content');
            contEl.setAttribute('id', 'bar');
            // const width = itemEl.clientWidth;
            // const height = itemEl.clientHeight;
            // console.log(contEl.clientWidth, contEl.clientHeight);

            // contEl.setAttribute('style', `width: ${width}px; height: ${height}px;`);
        });

        this.drawBars(this.data);
    }


    private drawBars(data: any[]): void {
        const barEl = document.getElementById('bar');
        console.log(barEl.clientWidth, barEl.clientHeight);
        this.svg = d3.select("#bar")
            .append("svg")
            .attr("width", barEl.clientWidth)
            .attr("height", barEl.clientHeight)
            .append("g")
            .attr("transform", "translate(" + this.margin + "," + this.margin + ")");

        // Create the X-axis band scale
        const x = d3.scaleBand()
            .range([0, barEl.clientWidth - this.margin * 2])
            .domain(data.map(d => d.Framework))
            .padding(0.2);

        // Draw the X-axis on the DOM
        this.svg.append("g")
            .attr("transform", "translate(0," + (barEl.clientHeight - this.margin * 2) + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Create the Y-axis band scale
        const y = d3.scaleLinear()
            .domain([0, 200000])
            .range([barEl.clientHeight - this.margin * 2, 0]);

        // Draw the Y-axis on the DOM
        this.svg.append("g")
            .call(d3.axisLeft(y));

        // Create and fill the bars
        this.svg.selectAll("bars")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d: any) => x(d.Framework))
            .attr("y", (d: any) => y(d.Stars))
            .attr("width", x.bandwidth())
            .attr("height", (d: any) => barEl.clientHeight - this.margin * 2 - y(d.Stars))
            .attr("fill", "steelblue")
        // .on('mouseover', function (d, i) {
        //     // Create a tooltip element and set its text content to the values of the corresponding data point
        //     const tooltip = d3.select(this)
        //         .style('fill', 'orange')
        //         .append('text')
        //         .attr('class', 'tooltip')
        //         .text(`${d.Framework}: ${d.Stars} stars, released on ${d.Released}`);
        //     console.log(`${d.Framework}: ${d.Stars} stars, released on ${d.Released}`)

        //     // Position the tooltip element relative to the mouse cursor
        //     const [x, y] = d3.mouse(this);
        //     tooltip.attr('x', x + 10)
        //         .attr('y', y - 10);
        // })
        // .on('mouseout', function (d, i) {
        //     // Remove the tooltip element
        //     d3.select(this)
        //         .style('fill', 'steelblue');
        // });
        // const legend = this.svg.append("g")
        //     .attr("class", "legend")
        //     .attr("transform", `translate(${barEl.clientWidth - 100}, 20)`);

        // // Create a group element for each legend item
        // const legendItems = legend.selectAll(".legend-item")
        //     .data(data)
        //     .enter()
        //     .append("g")
        //     .attr("class", "legend-item")
        //     .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        // // Append a rectangle element to each group element to represent the legend item
        // legendItems.append("rect")
        //     .attr("x", 0)
        //     .attr("y", 0)
        //     .attr("width", 10)
        //     .attr("height", 10)
        //     .attr("fill", "steelblue");

        // // Append a text element to each group element to represent the legend item
        // legendItems.append("text")
        //     .attr("x", 20)
        //     .attr("y", 10)
        //     .text((d: any) => d.Framework);
    }

}