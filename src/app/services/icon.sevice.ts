import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
    providedIn: 'root'
})
export class IconService {

    createIcon(svg, className, x, y, icon, clickHandler) {
        svg.append('foreignObject')
            .attr('class', className)
            .attr('x', x)
            .attr('y', y)
            .attr('width', 25)
            .attr('height', 25)
            .html(`<i class="fas fa-${icon}"></i>`)
            .on('click', clickHandler)
    }

    hoverSVG(svg) {
        svg.on('mouseover', function() {
            d3.select(this).selectAll('foreignObject').style('display', 'block');
        })
        .on('mouseout', function() {
            d3.select(this).selectAll('foreignObject').style('display', 'none');
        });
    }
    
}