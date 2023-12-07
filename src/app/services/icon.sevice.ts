import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
    providedIn: 'root'
})
export class TitleIconService {

    public createTitle(svg, x, y, text) {
        svg.append("text")
            .attr("class", "title")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text(text);
    }

    public createIcon(svg, x, y, icon, clickHandler) {
        svg.append('foreignObject')
            .attr('class', icon)
            .attr('x', x)
            .attr('y', y)
            .attr('width', 22)
            .attr('height', 22)
            .html(`<i class="fas fa-${icon}"></i>`)
            .on('click', clickHandler);
    }

    public hoverSVG(svg) {
        svg.on('mouseover', function() {
            d3.select(this).selectAll('foreignObject').style('display', 'block');
        })
        .on('mouseout', function() {
            d3.select(this).selectAll('foreignObject').style('display', 'none');
        });
    }

    public updateTitle(svg, barEL, margin): void {
        svg.select("text.title")
            .attr("x", (barEL.clientWidth / 2))
            .attr("y", margin / 2)
    }
        
    public updateIcons(svg, barEL): void {
        svg.select('foreignObject.pencil')
            .attr('x', barEL.clientWidth - 38)
            .attr('y', 20)

        svg.select('foreignObject.download')
            .attr('x', barEL.clientWidth - 38)
            .attr('y', 45)

        svg.select('foreignObject.heart')
            .attr('x', barEL.clientWidth - 38)
            .attr('y', 70)

        svg.select('foreignObject.trash')
            .attr('x', barEL.clientWidth - 36)
            .attr('y', 95)
    }
    
}