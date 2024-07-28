const MAJORS_WINNERS = {};
const NAME_MAPPING = {
    "masters": "The Masters",
    "pga": "PGA Championship",
    "theOpen": "The Open",
    "usOpen": "US Open"
};
const COUNTRIES_MAPPING = {};

window.onload = async () => {
    try {
        MAJORS_WINNERS.masters = await d3.csv("./data/majors/masters.csv", parseRow);
        MAJORS_WINNERS.pga = await d3.csv("./data/majors/pga.csv", parseRow);
        MAJORS_WINNERS.theOpen = await d3.csv("./data/majors/the_open.csv", parseRow);
        MAJORS_WINNERS.usOpen = await d3.csv("./data/majors/us_open.csv", parseRow);

        await loadCountriesAbbreviations();
        const pgaData = await loadPgaData();

        const tigerWins = await d3.csv("./data/tiger_woods_pga_wins.csv");
        const jackWins = await d3.csv("./data/jack_nicklaus_pga_wins.csv");

        const scenes = ["Scene1", "Scene2", "Scene3"];
        let currentPageIndex = 0;

        const prevButton = document.getElementById("prevButton");
        const nextButton = document.getElementById("nextButton");

        function showPage(index) {
            scenes.forEach((scene, i) => {
                const element = document.getElementById(scene);
                if (i === index) {
                    element.classList.add("active");
                    element.classList.remove("inactive");
                } else {
                    element.classList.add("inactive");
                    element.classList.remove("active");
                }
            });

            prevButton.disabled = index === 0;
            nextButton.disabled = index === scenes.length - 1;
        }

        prevButton.addEventListener("click", function() {
            if (currentPageIndex > 0) {
                currentPageIndex--;
                showPage(currentPageIndex);
                renderScene();
            }
        });

        nextButton.addEventListener("click", function() {
            if (currentPageIndex < scenes.length - 1) {
                currentPageIndex++;
                showPage(currentPageIndex);
                renderScene();
            }
        });

        function renderScene() {
            if (currentPageIndex === 0) {
                showScene1(getYearsWon(), 2000);
            } else if (currentPageIndex === 1) {
                initializeScene2(pgaData);
            } else if (currentPageIndex === 2) {
                initializeScene3(tigerWins, jackWins);
            }
        }

        showPage(currentPageIndex);
        renderScene();
    } catch (error) {
        console.error("Error loading data or initializing scenes:", error);
    }
}

function parseRow(d) {
    const r = {};
    Object.entries(d).forEach(([k, v]) => {
        r[k] = isNaN(v) ? v : +v;
    });
    return r;
}

function getMajorsWonBy(golfer) {
    const yearsWonByChampion = {};
    for (let tournament in MAJORS_WINNERS) {
        let yearsWon = [];
        MAJORS_WINNERS[tournament].forEach(item => {
            if (item.Champion === golfer) {
                yearsWon.push(item.Year);
            }
        });
        yearsWonByChampion[tournament] = yearsWon;
    }
    return yearsWonByChampion;
}

function getYearsWon() {
    const yearsWonList = [];
    for (let tournament in MAJORS_WINNERS) {
        MAJORS_WINNERS[tournament].forEach(item => {
            yearsWonList.push({
                golfer: item.Champion,
                year: item.Year,
                tournament: NAME_MAPPING[tournament]
            });
        });
    }
    return yearsWonList;
}

async function loadCountriesAbbreviations() {
    await d3.csv('./data/countries_abbreviations.csv').then(function(data) {
        data.forEach(row => {
            const countryName = row.name;
            const alpha2Code = row['alpha-2'];
            COUNTRIES_MAPPING[countryName] = alpha2Code;
        });
    });
}

async function loadPgaData() {
    let combinedData = [];
    const nationalities = await d3.csv('./data/pga_players_nationality.csv');
    const years = d3.range(2000, 2025);

    for (const year of years) {
        const rankingFile = `stats${year}.csv`;
        const earningsFile = `statse${year}.csv`;

        const rankingData = await d3.csv(`./data/pga_ranking/${rankingFile}`);
        const earningsData = await d3.csv(`./data/pga_earnings/${earningsFile}`);

        rankingData.forEach(rankItem => {
            const earningsItem = earningsData.find(e => e.PLAYER_ID === rankItem.PLAYER_ID);
            if (earningsItem) {
                combinedData.push({
                    year: year,
                    player: rankItem.PLAYER,
                    avgPoints: +rankItem['AVG POINTS'],
                    earnings: +earningsItem.MONEY,
                    playerId: rankItem.PLAYER_ID,
                    nationality: nationalities.find(n => n.Player === rankItem.PLAYER).Country
                });
            }
        });
    }
    return combinedData;
}

