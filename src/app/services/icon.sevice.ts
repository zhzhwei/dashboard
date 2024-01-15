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

    public createPencil(svg, x, y, clickHandler) {
        svg.append('foreignObject')
            .attr('class', 'pencil')
            .attr('x', x)
            .attr('y', y)
            .attr('width', 22)
            .attr('height', 22)
            .html(`<i class="fas fa-pencil"></i>`)
            .on('click', clickHandler);
    }

    public createDownload(svg, x, y, clickHandler) {
        svg.append('foreignObject')
            .attr('class', 'download')
            .attr('x', x)
            .attr('y', y)
            .attr('width', 22)
            .attr('height', 22)
            .html(`<i class="fas fa-download"></i>`)
            .on('click', clickHandler);
    }

    public createHeart(svg, x, y, color, clickHandler) {
        svg.append('foreignObject')
            .attr('class', 'heart')
            .attr('x', x)
            .attr('y', y)
            .attr('width', 22)
            .attr('height', 22)
            .html(`<i class="fas fa-heart"></i>`)
            .style('color', color)
            .on('click', clickHandler);
    }

    public createTrash(svg, x, y, clickHandler) {
        svg.append('foreignObject')
            .attr('class', 'trash')
            .attr('x', x)
            .attr('y', y)
            .attr('width', 22)
            .attr('height', 22)
            .html(`<i class="fas fa-trash"></i>`)
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
    
    public updateTrash(svg, barEL): void {
        svg.select('foreignObject.trash')
            .attr('x', barEL.clientWidth - 36)
            .attr('y', 20)
    }

    public updateHeart(svg, barEL): void {
        svg.select('foreignObject.heart')
            .attr('x', barEL.clientWidth - 38)
            .attr('y', 20)
    }

    public updateIcons(svg, barEL, color): void {
        // console.log(color)
        svg.select('foreignObject.pencil')
            .attr('x', barEL.clientWidth - 38)
            .attr('y', 20)

        svg.select('foreignObject.download')
            .attr('x', barEL.clientWidth - 38)
            .attr('y', 45)

        svg.select('foreignObject.heart')
            .attr('x', barEL.clientWidth - 38)
            .attr('y', 70)
            .select('i')
            .style('color', color)

        svg.select('foreignObject.trash')
            .attr('x', barEL.clientWidth - 36)
            .attr('y', 95)
    }
    
}