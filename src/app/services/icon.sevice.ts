import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
    providedIn: 'root'
})
export class IconService {

    createTitle(svg, x, y, text) {
        svg.append("text")
            .attr("class", "title")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text(text);
    }

    createIcon(svg, x, y, icon, clickHandler) {
        svg.append('foreignObject')
            .attr('class', icon)
            .attr('x', x)
            .attr('y', y)
            .attr('width', 25)
            .attr('height', 25)
            .html(`<i class="fas fa-${icon}"></i>`)
            .on('click', clickHandler);
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