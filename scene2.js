function initializeScene2(data) {
    const Scene = d3.select("#Scene2");
    const Content = Scene.select(".content");
    Content.html("");

    Content.append("h2").text("PGA Season Ranking (average points) vs PGA Trophy Earnings");

    Content.append("p")
        .text("Tiger Woods has a PGA career spanning 28 years, consistently topping season rankings. Even past his prime, he has made a strong comeback in his mid-40s and is still the highest earning player to date.")
        .style("font-size", "16px")
        .style("margin-bottom", "20px");

    const margin = { top: 20, right: 30, bottom: 40, left: 100 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = Content.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
    svg.append("g").attr("class", "y-axis");


    const yearSlider = document.getElementById("yearSlider");
    const selectedYear = document.getElementById("selectedYear");
    const toggleButton = document.getElementById("toggleButton");

    const years = d3.range(2000, 2025);
    yearSlider.max = years[years.length - 1];
    yearSlider.min = years[0];
    yearSlider.step = 1;
    yearSlider.value = years[0];
    selectedYear.textContent = yearSlider.value;

    yearSlider.addEventListener("input", function() {
        const year = +yearSlider.value;
        selectedYear.textContent = year;
        updateScene2(data, year, svg, width, height, margin);
    });

    let autoSlideInterval;
    let isAutoSliding = false;

    toggleButton.addEventListener("click", function() {
        if (isAutoSliding) {
            clearInterval(autoSlideInterval);
            toggleButton.textContent = "Start Auto-Slide";
        } else {
            autoSlideInterval = setInterval(() => {
                let currentValue = +yearSlider.value;
                let nextValue = currentValue + 1;
                if (nextValue > +yearSlider.max) {
                    nextValue = +yearSlider.min;
                }
                yearSlider.value = nextValue;
                const year = +yearSlider.value;
                selectedYear.textContent = year;
                updateScene2(data, year, svg, width, height, margin);
            }, 1000);
            toggleButton.textContent = "Stop Auto-Slide";
        }
        isAutoSliding = !isAutoSliding;
    });

    updateScene2(data, years[0], svg, width, height, margin);
}

function updateScene2(data, year, svg, width, height, margin) {
    const filteredData = data.filter(d => d.year === year);

    filteredData.forEach(d => {
        d.flag = getFlagPath(d.nationality);
    });


    const x = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => d.avgPoints))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain(d3.extent(filteredData, d => d.earnings))
        .range([height, 0]);


    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);


    svg.select(".x-axis").transition().duration(750).call(xAxis);
    svg.select(".y-axis").transition().duration(750).call(yAxis);


    const points = svg.selectAll("image.flag")
        .data(filteredData, d => d.player);


    points.exit()
        .transition().duration(750)
        .attr("x", -20)
        .attr("y", -20)
        .remove();


    points.transition().duration(750)
        .attr("xlink:href", d => d.flag)
        .attr("x", d => x(d.avgPoints) - 10)
        .attr("y", d => y(d.earnings) - 10)
        .attr("width", 20)
        .attr("height", 20);


    points.enter().append("image")
        .attr("xlink:href", d => d.flag)
        .attr("x", width + 20)
        .attr("y", d => y(d.earnings) - 10)
        .attr("width", 20)
        .attr("height", 20)
        .attr("class", "flag")
        .style("pointer-events", "all")
        .transition().duration(750)
        .attr("x", d => x(d.avgPoints) - 10)
        .on("end", function() { d3.select(this).on("mouseover", showTooltip).on("mousemove", showTooltip).on("mouseout", hideTooltip).on("click", function(event, d) { showDriverStats(d.player); }); });




    const tiger = svg.selectAll("circle.tiger").data(
    filteredData.filter(d => d.player === "Tiger Woods"));


    tiger.exit()
        .transition().duration(750)
        .attr("cx", -20)
        .attr("cy", -20)
        .remove();


    tiger.transition().duration(750)
        .attr("cx", d => x(d.avgPoints))
        .attr("cy", d => y(d.earnings))
        .attr("r", 15)
        .attr("stroke", "gold")
        .attr("stroke-width", 2)
        .attr("fill", "none");


    tiger.enter().append("circle")
        .attr("cx", width + 20)
        .attr("cy", d => y(d.earnings))
        .attr("r", 15)
        .attr("stroke", "gold")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .attr("class", "tiger")
        .transition().duration(750)
        .attr("cx", d => x(d.avgPoints));
}

const seenCountries = {}
function getFlagPath(country) {
    if (!seenCountries[country]) {
        seenCountries[country] = true;
        console.log(`./pics/flags/${COUNTRIES_MAPPING[country].toLowerCase()}.png`);
    }
    return `./pics/flags/${COUNTRIES_MAPPING[country].toLowerCase()}.png`;
}

const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background", "#fff")
    .style("border", "1px solid #ccc")
    .style("padding", "10px")
    .style("border-radius", "4px")
    .style("box-shadow", "0px 0px 5px rgba(0,0,0,0.3)");

const showTooltip = (event, d) => {
    tooltip.style("visibility", "visible")
        .html(`Player: ${d.player}<br>Avg Points: ${d.avgPoints}<br>Earnings: ${d.earnings}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
};

const hideTooltip = () => {
    tooltip.style("visibility", "hidden");
};
