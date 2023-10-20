import React, { useRef, useEffect } from 'react'

import * as d3 from "d3"

import BarChart from './BarChart';


type Props = {
  legislations: Legislations;
};



function VotesVisualization({ legislations }: Props) {

  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const height = ref.current!.clientHeight
    const width = ref.current!.clientWidth

    d3.csv("/legislation_seats.csv").then(data => {
      const demo = data.filter(d => d['Party'] === "Democrat")
      const rep = data.filter(d => d['Party'] === "Republican")

      const assemblyX = d3.scaleLinear().domain([0, 150]).range([0, width])
      const senateX = d3.scaleLinear().domain([0, 63]).range([0, width])
      const y = d3.scaleBand().domain(demo.map(d => d.House)).range([0, height]).padding(0.5);

      d3.selectAll(".barChart").remove()

      let svg = d3
        .select(ref.current)
        .append("svg")
        .attr("class", "barChart")
        .attr("width", width)
        .attr("height", height)

      svg.selectAll('defaultRects')
        .data(demo)
        .join('rect')
        .attr("class", "defaultRects")
        .attr("x", assemblyX(0))
        .attr("y", d => y(d.House) as number)
        .attr("width", width - 32)
        .attr('height', y.bandwidth() / 1.5)
        .attr('fill', "#EEEEEE")

      svg.selectAll('demoRects')
        .data(demo)
        .join('rect')
        .attr("class", "demoRects")
        .attr("x", assemblyX(0))
        .attr("y", d => y(d.House) as number)
        .attr("width", d => d.House === "Assembly" ? assemblyX(+d[legislations]) : senateX(+d[legislations]))
        .attr('height', y.bandwidth() / 1.5)
        .attr('fill', "#007CEE")

      svg.selectAll("repRects")
        .data(rep)
        .join("rect")
        .attr("class", "repRects")
        .attr("x", (d, i) => d.House === "Assembly" ? assemblyX(+demo[i][legislations]) : senateX(+demo[i][legislations]))
        .attr("y", d => y(d.House) as number)
        .attr("width", d => d.House === "Assembly" ? assemblyX(+d[legislations]) : senateX(+d[legislations]))
        .attr('height', y.bandwidth() / 1.5)
        .attr('fill', "#D04E40")





      // svg.append("text").attr("x", 0).attr("y", 20).style("font-size", "18px").style("font-weight", "semiBold").text("Assembly Support")   
    })

  }, [legislations])


  return (
    <div className='w-full h-[251px] text-black bg-white rounded-[8px]' ref={ref}>
    </div>
  )
}

export default VotesVisualization

// px-[16px] py-[22px]