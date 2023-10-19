import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GridStack } from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';

@Component({
    selector: 'gridstack',
    templateUrl: 'gridstack.component.html',
    styleUrls: ['gridstack.component.css']
})
export class GridStackComponent implements OnInit, AfterViewInit {
    grid: GridStack;
    constructor() { }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        const options = {
            margin: 5,
            column: 12,
            disableOneColumnMode: true,
            acceptWidgets: true,
            removable: '#trash',
            removeTimeout: 100
        };

        GridStack.setupDragIn('.newWidget', { appendTo: 'body', helper: 'clone' });

        const grids = GridStack.initAll(options);
        this.grid = grids[0];
        const serializedData = [
            { x: 0, y: 0, w: 4, h: 2, content: 'line chart' },
            { x: 4, y: 0, w: 2, h: 2, content: 'bar chart' },
            { x: 4, y: 2, w: 2, h: 2, content: 'pie chart' },
            { x: 6, y: 0, w: 2, h: 4, content: 'scatterplot' },
            { x: 8, y: 0, w: 2, h: 2, content: 'star plot' },
            { x: 10, y: 0, w: 2, h: 2, content: 'box plot' },
            { x: 0, y: 2, w: 2, h: 2, content: 'pie chart' },
            { x: 2, y: 2, w: 2, h: 4, content: 'scatterplot' },
            { x: 8, y: 2, w: 4, h: 2, content: 'line chart' },
            { x: 0, y: 4, w: 2, h: 2, content: 'bar chart' },
            { x: 4, y: 4, w: 4, h: 2, content: 'star plot' },
            { x: 8, y: 4, w: 2, h: 2, content: 'box plot' },
            { x: 10, y: 4, w: 2, h: 2, content: 'pie chart' },
        ];
        this.grid.load(serializedData);
    }

}
