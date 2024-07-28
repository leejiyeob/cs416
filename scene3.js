function initializeScene3(tigerWins, jackWins) {
    let allWins = [...tigerWins, ...jackWins];
    allWins = allWins.map(d => ({
        ...d,
        Player: tigerWins.includes(d) ? 'Tiger' : 'Jack'
    }));
    allWins.sort((a, b) => d3.ascending(+a.Year, +b.Year));

    const Scene = d3.select("#Scene3 .content");
    Scene.html("");

    const svg = Scene.append("svg")
        .attr("width", "100%")
        .attr("height", 1000);


    const cornerGroup = svg.append("g")
        .attr("transform", "translate(20, 20)");


    cornerGroup.append("text")
        .text("Tiger vs Jack: PGA Tour wins")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dominant-baseline", "hanging");


    cornerGroup.append("text")
        .text("Tiger Woods and Jack Nicklaus are the Ronaldo and Messi of golf. As contenders for the title of GOAT, Jack is a strong contender but Tiger still leads in sheer number of PGA trophies.")
        .style("font-size", "16px")
        .style("margin-top", "10px")
        .attr("x", 0)
        .attr("y", 30)
        .attr("dominant-baseline", "hanging");


    const legend = cornerGroup.append("g")
        .attr("transform", "translate(0, 80)");

    legend.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 10)
        .attr("fill", "orange");

    legend.append("text")
        .attr("x", 20)
        .attr("y", 5)
        .text("Tiger Woods")
        .attr("font-size", 14);

    legend.append("circle")
        .attr("cx", 0)
        .attr("cy", 30)
        .attr("r", 10)
        .attr("fill", "blue");

    legend.append("text")
        .attr("x", 20)
        .attr("y", 35)
        .text("Jack Nicklaus")
        .attr("font-size", 14);


    const maxWins = Math.max(tigerWins.length, jackWins.length);
    const maxRadius = 20 + maxWins * 5;

    const tigerCircle = svg.append("circle")
        .attr("cx", `30%`)
        .attr("cy", "50%")
        .attr("r", 20)
        .attr("fill", "orange");

    const jackCircle = svg.append("circle")
        .attr("cx", `70%`)
        .attr("cy", "50%")
        .attr("r", 20)
        .attr("fill", "blue");

    let tigerWinCount = 0;
    let jackWinCount = 0;
    let winIndex = 0;

    function updateCircles() {
        const currentWin = allWins[winIndex];
        if (currentWin.Player === 'Tiger') {
            tigerWinCount++;
            const tigerText = svg.append("text")
                .attr("class", "tigerText")
                .attr("x", "30%")
                .attr("y", "50%")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("dy", "0.35em")
                .text(`${currentWin.Tournament} ${currentWin.Year}`)
                .attr("font-size", 16)
                .attr("fill", "black")
                .attr("stroke", "white")
                .attr("stroke-width", "0.5px")
                .style("opacity", 0)
                .transition()
                .duration(300)
                .style("opacity", 1)
                .transition()
                .duration(300)
                .style("opacity", 0)
                .remove();

            tigerCircle.transition().attr("r", 20 + tigerWinCount * 5);
        } else if (currentWin.Player === 'Jack') {
            jackWinCount++;
            const jackText = svg.append("text")
                .attr("class", "jackText")
                .attr("x", "70%")
                .attr("y", "50%")
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("dy", "0.35em")
                .text(`${currentWin.Tournament} ${currentWin.Year}`)
                .attr("font-size", 16)
                .attr("fill", "black")
                .attr("stroke", "white")
                .attr("stroke-width", "0.5px")
                .style("opacity", 0)
                .transition()
                .duration(300)
                .style("opacity", 1)
                .transition()
                .duration(300)
                .style("opacity", 0)
                .remove();

            jackCircle.transition().attr("r", 20 + jackWinCount * 5);
        }

        winIndex++;
        if (winIndex < allWins.length) {
            setTimeout(updateCircles, 250);
        }
    }

    updateCircles();
}
