import { Component, OnInit, ViewChild } from '@angular/core';
import { GridStack } from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import { BarChartComponent } from '../diagram/bar-chart/bar-chart.component';
import { StackedBarChartComponent } from '../diagram/stacked-bar-chart/stacked-bar-chart.component';
import { StarPlotComponent } from '../diagram/star-plot/star-plot.component';
declare var ResizeObserver: any;

@Component({
    selector: 'app-gridstack',
    templateUrl: './gridstack.component.html',
    styleUrls: ['./gridstack.component.css']
})

export class GridStackComponent implements OnInit {
    @ViewChild(BarChartComponent) barChart: BarChartComponent;
    @ViewChild(StackedBarChartComponent) stackedChart: StackedBarChartComponent;
    @ViewChild(BarChartComponent) plotChart: BarChartComponent;
    @ViewChild(StarPlotComponent) starPlot: StarPlotComponent;

    private grid: GridStack;
    private serializedData: any[] = []
    private itemEl: any;

    private barContEl: any;
    private stackedContEl: any;
    private plotContEl: any;
    private starContEl: any;

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
            { x: 0, y: 0, w: 4, h: 3, minW: 3, minH: 3, name: 'bar chart' },
            { x: 4, y: 0, w: 4, h: 6, minW: 4, minH: 4, name: 'stacked bar chart' },
            { x: 8, y: 0, w: 4, h: 6, name: 'star plot' },
            { x: 0, y: 2, w: 4, h: 3, name: 'line chart' }
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
                    this.plotContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.plotContEl.setAttribute('id', 'plot');
                    break;
                case 'star plot':
                    var itemIndex = this.serializedData.findIndex(item => item.name === 'star plot');
                    this.itemEl = this.grid.getGridItems()[itemIndex];
                    this.starContEl = this.itemEl.querySelector('.grid-stack-item-content');
                    this.starContEl.setAttribute('id', 'star');
                    break;
            }
        });
    }

    ngAfterViewInit(): void {
        console.log(this.barChart);
        this.barChart.createChart(this.barChart.werkzeugData, 'bar');
        this.stackedChart.createChart(this.stackedChart.data);
        this.starPlot.createChart();
        
        // Create a new ResizeObserver
        const resizeObserver = new ResizeObserver(entries => {
            this.barChart.updateChart();
            this.stackedChart.updateChart();
            this.starPlot.updateChart();
        });

        // Observe the element for size changes
        resizeObserver.observe(this.barContEl);
        resizeObserver.observe(this.stackedContEl);
        resizeObserver.observe(this.starContEl);
    }

}