import { Component, OnInit, ViewChild } from '@angular/core';
import { BarChartComponent } from '../diagram/bar-chart/bar-chart.component';
import { StackedBarChartComponent } from '../diagram/stacked-bar-chart/stacked-bar-chart.component';
import { StarPlotComponent } from '../diagram/star-plot/star-plot.component';
import { PieChartComponent } from '../diagram/pie-chart/pie-chart.component';
import { DoughnutComponent } from '../diagram/doughnut/doughnut.component';
import { LineChartComponent } from '../diagram/line-chart/line-chart.component';

import { combineLatest } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { GridStack, GridStackElement, GridHTMLElement } from 'gridstack';
import { ChartService } from '../services/chart.service';

import 'gridstack/dist/h5/gridstack-dd-native';

declare var ResizeObserver: any;

@Component({
    selector: 'app-gridstack',
    templateUrl: './gridstack.component.html',
})

export class GridStackComponent implements OnInit {
    @ViewChild(BarChartComponent) barChart: BarChartComponent;
    @ViewChild(StackedBarChartComponent) stackedBarChart: StackedBarChartComponent;
    @ViewChild(StarPlotComponent) starPlot: StarPlotComponent;
    @ViewChild(PieChartComponent) pieChart: PieChartComponent;
    @ViewChild(DoughnutComponent) donutChart: DoughnutComponent;
    @ViewChild(LineChartComponent) lineChart: LineChartComponent;

    private minorGrid: GridStack;
    private majorGrid: GridStack;
    public majorInitImage: boolean = true;
    public minorInitImage: boolean = true;

    private itemEl: any;
    public barContEl: any;
    public stackedBarContEl: any;
    public starContEl: any;
    public pieContEl: any;
    public donutContEl: any;
    public lineContEl: any;

    private contElsAndObservers = {};

    private options = {
        margin: 5,
        column: 12,
        cellHeight: "auto",
        disableOneColumnMode: true,
        acceptWidgets: true,
        removable: '#trash',
        removeTimeout: 100
    };

    public chartTypeNum = {
        'Line Chart': 0,
        'Stacked Line Chart': 0,
        'Bar Chart': 0,
        'Stacked Bar Chart': 0,
        'Pie Chart': 0,
        'Doughnut': 0,
        'Star Plot': 0,
        'Star Plots': 0
    };

    private newTile = {
        w: 3, h: 3,
        minW: 3, minH: 3,
        autoPosition: true,
    };

    constructor(private chartService: ChartService) { }

    ngOnInit(): void {
        // GridStack.setupDragIn('.newWidget', { appendTo: 'body', helper: 'clone' });
        this.majorGrid = GridStack.init(this.options, '#major-grid');
        this.majorGrid.addWidget({
            w: 3, h: 3, minW: 12, minH: 3,
            content: '<ion-icon name="help-buoy-outline" style="color: white; background-color: #5763cc; height: 100%; width: 100%"></ion-icon>',
            noResize: true,
        });
        this.minorGrid = GridStack.init(this.options, '#minor-grid');
        this.minorGrid.addWidget({
            w: 3, h: 3, minW: 12, minH: 3,
            content: '<ion-icon name="heart" style="color: white; background-color: rgb(115, 105, 148); height: 100%; width: 100%"></ion-icon>',
            noResize: true,
        });
        let minorGridEl = document.querySelector('#minor-grid') as GridHTMLElement;
        minorGridEl.style.display = 'none';
    }

    ngAfterViewInit() {
        combineLatest([
            this.chartService.currentChartType,
            this.chartService.currentDataSource
        ]).pipe(
            switchMap(([chartType, dataSource]) => {
                if (chartType && dataSource.length > 0) {
                    return this.chartService.chartAction.pipe(
                        map((chartAction): { chartType: string, dataSource: any[], action?: string, serial?: string, jobName?: string, titleCount?: number, pieLabel?: string } => {
                            if (chartAction && typeof chartAction === 'object') {
                                return { chartType, dataSource, ...chartAction };
                            } else {
                                return { chartType, dataSource };
                            }
                        })
                    );
                } else {
                    return EMPTY;
                }
            })
        ).subscribe(({ chartType, dataSource, action, serial, jobName, titleCount, pieLabel }) => {
            var chartCreators = {
                'Bar Chart': this.barChart.createChart.bind(this.barChart),
                'Pie Chart': this.pieChart.chartCreateOrUpdate.bind(this.pieChart),
            };
        
            var conditions = {
                'Bar Chart': jobName && titleCount > 0,
                'Pie Chart': jobName && pieLabel
            };
        
            var parameter = chartType === 'Bar Chart' ? titleCount : pieLabel;
        
            if (action === 'Create') {
                if (this.majorInitImage) {
                    this.majorGrid.removeAll();
                    this.majorInitImage = false;
                }
                if (conditions[chartType]) {
                    serial = this.getTileSerial(chartType, dataSource);
                    console.log('chartAction', { chartType, dataSource, action, serial, jobName, parameter });
                    chartCreators[chartType](serial, jobName, dataSource, parameter, true);
                    this.chartService.savePersistence(chartType, serial, dataSource, jobName, parameter);
                }
            } else if (action === 'Edit') {
                this.itemEl = document.getElementById(serial);
                this.itemEl.innerHTML = '';
                chartCreators[chartType](serial, jobName, dataSource, parameter);
                this.chartService.savePersistence(chartType, serial, dataSource, jobName, parameter);
            }
        
            this.chartService.chartType.next('');
            this.chartService.dataSource.next([]);
        });

        console.log(localStorage.length);

        this.chartService.loadPersistence();
        // localStorage.clear();

        this.majorGrid.on('change', (event, items) => this.mergeItem(event, items));

        this.chartService.currentDiagramFavorite.subscribe(diagramFavorite => {
            if (diagramFavorite.favorite) {
                if (this.minorInitImage) {
                    this.minorGrid.removeAll();
                    this.minorInitImage = false;
                }
                // console.log('diagramFavorite:', diagramFavorite);
                let element = document.getElementById(diagramFavorite.serial);
                let gridItemElement = element.closest('.grid-stack-item');
                let gridItemElementClone = gridItemElement.cloneNode(true) as GridStackElement;
                var itemEl = this.minorGrid.addWidget(gridItemElementClone);
                var contEl = itemEl.querySelector('.grid-stack-item-content');
                contEl.setAttribute('id', 'minor-' + diagramFavorite.serial);
                // this.chartService.savePersistence(diagramFavorite.type, 'minor' + diagramFavorite.serial, [], '', '');
            }
            else {
                if (!this.minorInitImage) {
                    let element = document.getElementById(diagramFavorite.serial);
                    let gridItemElement = element.closest('.grid-stack-item');
                    this.minorGrid.removeWidget(gridItemElement as GridStackElement);
                }
            }
        });

        this.chartService.currentDiagramRemoved.subscribe(diagramRemoved => {
            if (diagramRemoved.removed) {
                switch (diagramRemoved.type) {
                    case 'Bar Chart':
                        this.barChart.barRemoved = true;
                        break;
                    case 'Pie Chart':
                        this.pieChart.pieRemoved = true;
                        break;
                }
                let element = document.getElementById(diagramRemoved.serial);
                let gridItemElement = element.closest('.grid-stack-item');
                this.majorGrid.removeWidget(gridItemElement as GridStackElement);
                this.chartService.removePersistence(diagramRemoved.serial);
            }
        });
    }

    private getTileSerial(chartType: string, dataSource: any[]) {
        var itemEl = this.majorGrid.addWidget(this.newTile);
        this.chartTypeNum[chartType]++;
        var contEl = itemEl.querySelector('.grid-stack-item-content');
        var chartActions = {
            'Bar Chart': {
                setTileSerial: () => 'dash-bar-' + this.chartTypeNum[chartType],
                updateChart: (tileSerial) => {
                    if (!this.barChart.barRemoved) {
                        this.barChart.updateChart(tileSerial, dataSource);
                    }
                }
            },
            'Pie Chart': {
                setTileSerial: () => 'dash-pie-' + this.chartTypeNum[chartType],
                updateChart: (tileSerial) => {
                    if (!this.pieChart.pieRemoved) {
                        this.pieChart.chartCreateOrUpdate(tileSerial, '', dataSource, '', false);
                    }
                }
            }
        };
        var tileSerial = chartActions[chartType].setTileSerial();
        contEl.setAttribute('id', tileSerial);
        var resizeObserver = new ResizeObserver(entries => {
            chartActions[chartType].updateChart(tileSerial);
        });
        resizeObserver.observe(contEl);
        return tileSerial;
    }

    private mergeItem(event, items) {
        var nodes = this.majorGrid.getGridItems();
        for (var i = 0; i < nodes.length; i++) {
            for (var j = i + 1; j < nodes.length; j++) {
                if (this.isOverlap(nodes[i], nodes[j])) {
                    // console.log('overlap');
                    break;
                }
            }
        }
    }
    
    private isOverlap(item1, item2) {
        return !(item2.x >= item1.x + item1.width || item2.x + item2.width <= item1.x ||
                 item2.y >= item1.y + item1.height || item2.y + item2.height <= item1.y);
    }

}