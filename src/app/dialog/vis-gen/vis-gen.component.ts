import { Component, OnInit, ViewChild } from '@angular/core';
import { BarChartComponent } from '../../diagram/bar-chart/bar-chart.component';
import { StackedBarChartComponent } from '../../diagram/stacked-bar-chart/stacked-bar-chart.component';
import { StarPlotComponent } from '../../diagram/star-plot/star-plot.component';
import { GridStackComponent } from '../../gridstack/gridstack.component';

declare var ResizeObserver: any;

@Component({
    selector: 'app-vis-gen',
    templateUrl: './vis-gen.component.html',
    styleUrls: ['./vis-gen.component.css']
})
export class VisGenComponent implements OnInit {
    @ViewChild(BarChartComponent) barChart: BarChartComponent;
    @ViewChild(StackedBarChartComponent) stackedChart: StackedBarChartComponent;
    @ViewChild(StarPlotComponent) starPlot: StarPlotComponent;

    constructor() { }

    public chartType: string;
    public gridStack: GridStackComponent;

    ngOnInit(): void {

    }

    // ngAfterViewInit(): void {
    //     // Create a new ResizeObserver
    //     console.log(this);
    //     const resizeObserver = new ResizeObserver(entries => {
    //         this.barChart.updateChart();
    //         this.stackedChart.updateChart();
    //         this.starPlot.updateChart();
    //     });

    //     this.gridStack = new GridStackComponent();
    //     // Observe the element for size changes
    //     console.log(this.gridStack);
    //     resizeObserver.observe(this.gridStack.barContEl);
    //     resizeObserver.observe(this.gridStack.stackedContEl);
    //     resizeObserver.observe(this.gridStack.starContEl);
    // }

    public genVis() {
        switch (this.chartType) {
            case 'Bar Chart':
                // console.log(this);
                this.barChart.createChart(this.barChart.werkzeugData);
                break;
            case 'Stacked Bar Chart':
                this.stackedChart.createChart(this.stackedChart.data);
                break;
            case 'Star Plot':
                this.starPlot.createChart();
                break;
            case 'Pie Chart':
                // this.pieChartComponent.createChart();
                break;
            default:
                console.log('Invalid Chart Type');
        }
    }

    public updateVis() {
        // Create a new ResizeObserver
        const resizeObserver = new ResizeObserver(entries => {
            this.barChart.updateChart();
            this.stackedChart.updateChart();
            this.starPlot.updateChart();
        });

        this.gridStack = new GridStackComponent();
        // Observe the element for size changes
        console.log(this.gridStack);
        resizeObserver.observe(this.gridStack.barContEl);
        resizeObserver.observe(this.gridStack.stackedContEl);
        resizeObserver.observe(this.gridStack.starContEl);
    }

}
