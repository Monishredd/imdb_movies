// Set up SVG canvas
const width = 800, height = 500;
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

// Load the CSV dataset
d3.csv("imdb.csv").then(data => {
    data.forEach(d => {
        d.IMDB_Rating = +d.IMDB_Rating;  // Convert to number
        d.Released_Year = +d.Released_Year;  // Convert to number
    });

    // Create scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Released_Year))
        .range([50, width - 50]);

    const yScale = d3.scaleLinear()
        .domain([0, 10])  // IMDb ratings are between 0 and 10
        .range([height - 50, 50]);

    // Create axes
    svg.append("g")
        .attr("transform", `translate(0, ${height - 50})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg.append("g")
        .attr("transform", `translate(50, 0)`)
        .call(d3.axisLeft(yScale));

    // Create circles for each movie
    const circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Released_Year))
        .attr("cy", d => yScale(d.IMDB_Rating))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .attr("data-genre", d => d.Genre);

    // Add tooltip on hover
    circles.append("title")
        .text(d => `${d.Series_Title} (${d.Released_Year}) - Rating: ${d.IMDB_Rating}`);

    // Create genre filter dropdown
    const genres = [...new Set(data.map(d => d.Genre))];
    const dropdown = d3.select("#genreFilter");

    dropdown.append("option")
        .attr("value", "All")
        .text("All Genres");

    genres.forEach(genre => {
        dropdown.append("option")
            .attr("value", genre)
            .text(genre);
    });

    // Filter function
    dropdown.on("change", function () {
        const selectedGenre = this.value;
        circles.style("visibility", d => (selectedGenre === "All" || d.Genre === selectedGenre) ? "visible" : "hidden");
    });
});
