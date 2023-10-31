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
    private barContEl: any;
    private stackedContEl: any;
    private barPlotEl: any;
    private boxContEl: any;
    private starContEl: any;
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
            { x: 0, y: 0, w: 4, h: 3, name: 'bar plot' },
            { x: 4, y: 0, w: 4, h: 6, name: 'stacked bar chart' },
            { x: 8, y: 0, w: 4, h: 4, name: 'star plot' },
            { x: 0, y: 2, w: 4, h: 3, name: 'bar chart' },
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
                    this.barContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.barContEl.setAttribute('id', 'bar');
                    this.barChart = new BarChartComponent();
                    this.barChart.drawBars(this.barChart.werkzeugData, 'bar');
                    break;
                case 'stacked bar chart':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'stacked bar chart');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.stackedContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.stackedContEl.setAttribute('id', 'stacked');
                    break;
                case 'bar plot':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'bar plot');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.barPlotEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.barPlotEl.setAttribute('id', 'plot');
                    this.barChart = new BarChartComponent();
                    this.barChart.drawBars(this.barChart.feinwerkData, 'plot');
                    break;
                case 'box plot':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'box plot');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.boxContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.boxContEl.setAttribute('id', 'box');
                    break;
                case 'star plot':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'star plot');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.starContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.starContEl.setAttribute('id', 'star');
                    break;
            }
        });

        this.stackedBarChart = new StackedBarChartComponent();
        this.stackedBarChart.drawBars(this.stackedBarChart.data);
    }

    ngAfterViewInit(): void {
        // Create a new ResizeObserver
        const resizeObserver = new ResizeObserver(entries => {
            this.barChart.updateBars();
            this.stackedBarChart.updateBars();
        });

        // Observe the element for size changes
        resizeObserver.observe(this.barContEl);
        resizeObserver.observe(this.stackedContEl);
    }

}