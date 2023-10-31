import { Component, OnInit } from '@angular/core';
import { GridStack } from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import { BarChartComponent } from '../barchart/barchart.component';
import { StackedBarChartComponent } from '../stackbarchart/stackbarchart.component';

@Component({
    selector: 'app-gridstack',
    templateUrl: './gridstack.component.html',
    styleUrls: ['./gridstack.component.css']
})
export class GridStackComponent implements OnInit {

    constructor() { }

    private grid: GridStack;
    private serializedData: any[] = []
    private contEl: any;
    private itemEl: any;
    private barChart: BarChartComponent;
    private stackedBarChart: StackedBarChartComponent;

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
            { x: 0, y: 0, w: 4, h: 2, name: 'star plot' },
            { x: 4, y: 0, w: 4, h: 6, name: 'stacked bar chart' },
            { x: 8, y: 0, w: 4, h: 4, name: 'box plot' },
            { x: 0, y: 2, w: 4, h: 4, name: 'bar chart' },
            { x: 8, y: 4, w: 4, h: 2, name: 'scatter plot' },
        ];

        this.grid.load(this.serializedData);

        // Load the serialized data into the grid
        this.serializedData.forEach(item => {
            // check item.name and set id accordingly
            switch (item.name) {
                case 'bar chart':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'bar chart');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.contEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.contEl.setAttribute('id', 'bar');
                    break;
                case 'stacked bar chart':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'stacked bar chart');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.contEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.contEl.setAttribute('id', 'stacked');
                    break;
                case 'box plot':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'box plot');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.contEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.contEl.setAttribute('id', 'box');
                    break;
                case 'star plot':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'star plot');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.contEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.contEl.setAttribute('id', 'star');
                    break;
            }
        });

        this.barChart = new BarChartComponent();
        this.barChart.drawBars(this.barChart.data);

        this.stackedBarChart = new StackedBarChartComponent();
        this.stackedBarChart.drawBars(this.stackedBarChart.data);
    }

    ngAfterViewInit(): void {
        // Create a new ResizeObserver
        const resizeObserver = new ResizeObserver(entries => {
            this.barChart.updateBars();
        });

        // Observe the element for size changes
        resizeObserver.observe(this.contEl);
    }

}