function showScene1(data, minYear) {
    const filteredData = data.filter((d) => d.year >= minYear);

    const Scene = d3.select("#Scene1");
    const Content = Scene.select(".content");
    Content.html("");

    Content.append("h2").text("Tiger vs Major Golf Championships");

    Content.append("p").text(
        "Tiger Woods achieved the Career Grand Slam by winning all four major championships. " +
        "He has a 15 major wins, spanning over 11 years. He is only second to Jack Nicklaus with 18."
    )
     .style("margin-top", "10px")
     .style("margin-bottom", "20px");


    const golfers = [...new Set(filteredData.map(d => d.golfer))];
    const margin = { top: 20, right: 30, bottom: 30, left: 100 };
    const width = 1000 - margin.left - margin.right;
    const height = 1000 - margin.top - margin.bottom;

    const x = d3.scaleTime()
        .domain(d3.extent(filteredData, d => new Date(d.year, 0, 1)))
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(golfers)
        .range([0, height])
        .padding(0.1);

    const opacityScale = d3.scaleLinear()
        .domain([1, d3.max(filteredData, d => {
            const counts = d3.rollup(filteredData, v => v.length, d => d.golfer, d => d.year);
            return d3.max(Array.from(counts.values()), d => d.length);
        })])
        .range([0.2, 1]);

    const svg = Content.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    const xAxis = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(d3.timeYear.every(1)).tickFormat(d3.timeFormat("%Y")));


    const yAxis = svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));


    yAxis.selectAll("text")
        .style("cursor", "pointer")
        .on("click", function(event, d) {
            showDriverStats(d);
        });


    const groupedData = d3.groups(filteredData, d => d.golfer, d => d.year);

    groupedData.forEach(([golfer, years]) => {
        years.forEach(([year, tournaments]) => {
            const numWins = tournaments.length;
            svg.append("rect")
                .attr("class", "bar")
                .attr("x", x(new Date(year, 0, 1)) - 5)
                .attr("y", y(golfer))
                .attr("width", 10)
                .attr("height", y.bandwidth())
                .attr("fill", golfer === "Tiger Woods" ? "gold" : "#000")
                .attr("opacity", opacityScale(numWins))
                .attr("title", `${year}: ${numWins} majors`)
                .style("cursor", "pointer")
                .on("click", function() {
                    showDriverStats(golfer);
                });
        });
    });


    golfers.forEach(golfer => {
        const golferData = filteredData.filter(d => d.golfer === golfer).map(d => new Date(d.year, 0, 1));
        if (golferData.length > 1) {
            const firstWin = d3.min(golferData);
            const lastWin = d3.max(golferData);

            svg.append("line")
                .attr("x1", x(firstWin))
                .attr("y1", y(golfer) + y.bandwidth() / 2)
                .attr("x2", x(lastWin))
                .attr("y2", y(golfer) + y.bandwidth() / 2)
                .attr("stroke", golfer === "Tiger Woods" ? "gold" : "black")
                .attr("stroke-width", 2)
                .style("cursor", "pointer")
                .on("click", function() {
                    showDriverStats(golfer);
                });
        }
    });
}

function showDriverStats(driverId) {





    showHeader(driverId);

    const html = computeDriverSummaryHtml(driverId);
    const Subtitle = d3.select("#Sidebar .subtitle");
    Subtitle.html(html);
}

function showHeader(textOrHtml) {

    d3.select("#Sidebar .headline")
    .html(textOrHtml);
}

function computeDriverSummaryHtml(golferName) {
    const majorsWonByGolfer = getMajorsWonBy(golferName); //

    let result = ``;

    for (const tournament in majorsWonByGolfer) {
        const name = NAME_MAPPING[tournament];
        majorsWonByGolfer[tournament].forEach(year => {
            result += `<p>${year} ${name}</p>`;
        });
    }

    return result;
}