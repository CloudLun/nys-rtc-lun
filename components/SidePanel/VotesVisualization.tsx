import React, { useRef, useEffect, useContext } from 'react'
import { MapContext, MapContextType } from '../../context/MapContext'

import * as d3 from "d3"


type Props = {
  legislation: Legislations;
};



function VotesVisualization({ legislation }: Props) {

  const { districts } = useContext(MapContext) as MapContextType

  const ref = useRef<SVGSVGElement | null>(null)
  const effectRan = useRef(false)

  useEffect(() => {

    const height = ref.current!.clientHeight
    const width = ref.current!.clientWidth

    const svg = d3.select(ref.current)

    d3.csv("/legislation_seats.csv").then(data => {
      console.log(data)
      const demo = data.filter(d => d['Party'] === "Democrat")
      const rep = data.filter(d => d['Party'] === "Republican")

      const senate = data.filter(d => d["House"] === "Senate")
      const assembly = data.filter(d => d["House"] === "Assembly")

      const senateTotalVotes = +senate[0][legislation] + (+senate[1][legislation])
      const assemblyTotalVotes = +assembly[0][legislation] + (+assembly[1][legislation])

      const assemblyX = d3.scaleLinear().domain([0, 150]).range([0, width])
      const senateX = d3.scaleLinear().domain([0, 63]).range([0, width])
      const y = d3.scaleBand().domain(demo.map(d => d.House)).range([0, height]).padding(0.5);

      // Rects  
      svg.selectAll('defaultRects')
        .data(demo)
        .join('rect')
        .attr("class", "defaultRects")
        .attr("x", assemblyX(0))
        .attr("y", (d, i) => i === 0 ? y(d.House) as number : y(d.House) as number + 20)
        .attr("width", width - 30)
        .attr('height', y.bandwidth() / 1.5)
        .attr('fill', "#EEEEEE")

      svg.selectAll('demoRects')
        .data(demo)
        .join('rect')
        .attr("class", d => `demoRects${d.House}`)
        .attr("x", assemblyX(0))
        .attr("y", (d, i) => i === 0 ? y(d.House) as number : y(d.House) as number + 20)
        .attr("width", d => d.House === "Assembly" ? assemblyX(+d[legislation]) : senateX(+d[legislation]))
        .attr('height', y.bandwidth() / 1.5)
        .attr('fill', "#007CEE")
        .on("mouseover", (e, i) => {
          if (e.target.className.baseVal === `demoRectsSenate`) {
            svg.selectAll(".totalVotes").attr("fill-opacity", (d, i) => (d as { House: "Senate" | "Assembly" }).House === "Senate" ? 0 : 1)
            svg.selectAll(".demoPartyVotes").attr("fill-opacity", (d, i) => i === 0 ? 1 : 0)
          }
          if (e.target.className.baseVal === `demoRectsAssembly`) {
            svg.selectAll(".totalVotes").attr("fill-opacity", (d, i) => (d as { House: "Senate" | "Assembly" }).House === "Assembly" ? 0 : 1)
            svg.selectAll(".demoPartyVotes").attr("fill-opacity", (d, i) => i === 1 ? 1 : 0)
          }
        })
        .on("mouseout", () => {
          svg.selectAll(".demoPartyVotes").attr("fill-opacity", 0)
          svg.selectAll(".totalVotes").attr("fill-opacity", 1)
        })

      svg.selectAll("repRects")
        .data(rep)
        .join("rect")
        .attr("class", d => `repRects${d.House}`)
        .attr("x", (d, i) => d.House === "Assembly" ? assemblyX(+demo[i][legislation]) : senateX(+demo[i][legislation]))
        .attr("y", (d, i) => i === 0 ? y(d.House) as number : y(d.House) as number + 20)
        .attr("width", d => d.House === "Assembly" ? assemblyX(+d[legislation]) : senateX(+d[legislation]))
        .attr('height', y.bandwidth() / 1.5)
        .attr('fill', "#D04E40")
        .on("mouseover", (e, i) => {
          if (e.target.className.baseVal === `repRectsSenate`) {
            svg.selectAll(".totalVotes").attr("fill-opacity", (d, i) => (d as { House: "Senate" | "Assembly" }).House === "Senate" ? 0 : 1)
            svg.selectAll(".repPartyVotes").attr("fill-opacity", (d, i) => i === 0 ? 1 : 0)
          }
          if (e.target.className.baseVal === `repRectsAssembly`) {
            svg.selectAll(".totalVotes").attr("fill-opacity", (d, i) => (d as { House: "Senate" | "Assembly" }).House === "Assembly" ? 0 : 1)
            svg.selectAll(".repPartyVotes").attr("fill-opacity", (d, i) => i === 1 ? 1 : 0)
          }
        })
        .on("mouseout", () => {
          svg.selectAll(".repPartyVotes").attr("fill-opacity", 0)
          svg.selectAll(".totalVotes").attr("fill-opacity", 1)
        })

      // Labels
      svg.selectAll('districtSupport')
        .data(demo)
        .enter()
        .append("text")
        .attr("x", 20)
        .attr("y", (d, i) => i === 0 ? y(d.House) as number - 30 : y(d.House) as number - 10)
        .style("font-size", "18px")
        .style("font-weight", "semiBold")
        .text(d => `${d.House} Support`)

      svg.selectAll("totalSeats")
        .data(demo)
        .enter()
        .append("text")
        .attr("class", 'totalSeats')
        .attr("x", (d, i) => i === 0 ? width - 70 : width - 76)
        .attr("y", (d, i) => i === 0 ? y(d.House) as number - 10 : y(d.House) as number + 10)
        .style("font-size", "12px")
        .style("font-weight", "regular")
        .text((d, i) => i === 0 ? "63 seats" : "150 seats")

      svg.selectAll("supportPercentage")
        .data(demo)
        .enter()
        .append("text")
        .attr("class", 'totalSeats')
        .attr("x", 0)
        .attr("y", (d, i) => i === 0 ? y(d.House) as number - 10 : y(d.House) as number + 10)
        .style("font-size", "13px")
        .style("font-weight", "semiBold")
        .text((d, i) => i === 0 ? `${Math.round(senateTotalVotes/63*100)}%` : `${Math.round(assemblyTotalVotes/150*100)}%`)

      svg.selectAll('totalVotes')
        .data(demo)
        .enter()
        .append("text")
        .attr('class', "totalVotes")
        .attr("x", 0)
        .attr("y", (d, i) => i === 0 ? y(d.House) as number + y.bandwidth() + 2 : y(d.House) as number + y.bandwidth() + 22)
        .attr('fill', "#121D3E")
        .style("font-size", "13px")
        .style("font-weight", "semiBold")
        .text((d, i) => i === 0 ? `${senateTotalVotes} votes` : `${assemblyTotalVotes} votes`)


      svg.selectAll('demoPartyVotes')
        .data(demo)
        .enter()
        .append("text")
        .attr('class', "demoPartyVotes")
        .attr("x", 0)
        .attr("y", (d, i) => i === 0 ? y(d.House) as number + y.bandwidth() + 2 : y(d.House) as number + y.bandwidth() + 22)
        .attr('fill', "#0057A8")
        .attr("fill-opacity", 0)
        .style("font-size", "13px")
        .style("font-weight", "semiBold")
        .text(d => `${+d[legislation]} Democratic votes`)

      svg.selectAll('repPartyVotes')
        .data(rep)
        .enter()
        .append("text")
        .attr('class', 'repPartyVotes')
        .attr("x", 0)
        .attr("y", (d, i) => i === 0 ? y(d.House) as number + y.bandwidth() + 2 : y(d.House) as number + y.bandwidth() + 22)
        .attr('fill', "#A03327")
        .attr("fill-opacity", 0)
        .style("font-size", "13px")
        .style("font-weight", "semiBold")
        .text(d => `${+d[legislation]} Republican votes`)


      svg.selectAll('majorityLabels')
        .data(demo)
        .enter()
        .append("text")
        .attr('class', "majorityLabels")
        .attr("x", (width - 30) / 2 - 2)
        .attr("y", (d, i) => i === 0 ? y(d.House) as number + y.bandwidth() + 2 : y(d.House) as number + y.bandwidth() + 22)
        .attr('fill', "#7B7B7B")
        .attr("fill-opacity", 0)
        .style("font-size", "10px")
        .style("font-weight", "semiBold")
        .text((d, i) => `${i === 0 ? "33" : "76"} votes, simple majority`)

      svg.selectAll('superMajorityLabels')
        .data(demo)
        .enter()
        .append("text")
        .attr('class', "superMajorityLabels")
        .attr("x", (width - 30) / 4 * 3 - 2)
        .attr("y", (d, i) => i === 0 ? y(d.House) as number + y.bandwidth() + 2 : y(d.House) as number + y.bandwidth() + 22)
        .attr('fill', "#7B7B7B")
        .attr("fill-opacity", 0)
        .style("font-size", "10px")
        .style("font-weight", "semiBold")
        .text((d, i) => `${i === 0 ? "42" : "100"} votes,  supermajority`)

      // Icons
      svg.selectAll("districtsIcons")
        .data(demo)
        .enter()
        .append("image")
        .attr("x", 0)
        .attr("y", (d, i) => i === 0 ? y(d.House) as number - 44 : y(d.House) as number - 24)
        .attr('width', 16)
        .attr("height", 16)
        .attr("xlink:href", (d, i) => {
          if (districts === "senate") {
            if (i === 0) return "/icons/districts_fill.svg"
            if (i === 1) return "/icons/districts_empty.svg"
          } else {
            if (i === 0) return "/icons/districts_empty.svg"
            if (i === 1) return "/icons/districts_fill.svg"
          }
          return ""
        })

      // Dash Lines
      svg.selectAll("majority")
        .data(demo)
        .enter()
        .append("line")
        .attr("x1", (width - 30) / 2)
        .attr("y1", (d, i) => i === 0 ? y(d.House) as number - 10 : y(d.House) as number + 10)
        .attr("x2", (width - 30) / 2)
        .attr("y2", (d, i) => i === 0 ? y(d.House) as number - 10 + y.bandwidth() + 2 : y(d.House) as number + 10 + y.bandwidth() + 2)
        .style("stroke", "#7B7B7B")
        .style("stroke-dasharray", ("2, 3"))
        .on("mouseover", () => {
          svg.selectAll(".majorityLabels").attr("fill-opacity", 1)
        })
        .on("mouseout", () => {
          svg.selectAll(".majorityLabels").attr("fill-opacity", 0)
        })

      svg.selectAll("superMajority")
        .data(demo)
        .enter()
        .append("line")
        .attr("x1", (width - 30) / 4 * 3)
        .attr("y1", (d, i) => i === 0 ? y(d.House) as number - 10 : y(d.House) as number + 10)
        .attr("x2", (width - 30) / 4 * 3)
        .attr("y2", (d, i) => i === 0 ? y(d.House) as number - 10 + y.bandwidth() + 2 : y(d.House) as number + 10 + y.bandwidth() + 2)
        .style("stroke", "#7B7B7B")
        .style("stroke-dasharray", ("2, 3"))
        .on("mouseover", () => {
          svg.selectAll(".superMajorityLabels").attr("fill-opacity", 1)
        })
        .on("mouseout", () => {
          svg.selectAll(".superMajorityLabels").attr("fill-opacity", 0)
        })

    })

    return () => { effectRan.current = true }

  }, [districts])


  return (

    <svg className='w-full h-[251px] text-black bg-white rounded-[8px]' ref={ref}>
    </svg>
  )
}

export default VotesVisualization
