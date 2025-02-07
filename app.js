// Set up SVG canvas
const width = 800, height = 500;
const svg = d3.select("svg");

// Load the CSV dataset
d3.csv("static/data/cleaned_dataset_imdb.csv").then(data => {
    data.forEach(d => {
        d.Rating = +d.Rating;  // Convert to number
        d.Year = +d.Year;  // Convert to number
    });

    // Create scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year))
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
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d.Rating))
        .attr("r", 5)
        .attr("data-genre", d => d.Genre);

    // Add tooltip on hover
    circles.append("title")
        .text(d => `${d.Title} (${d.Year}) - Rating: ${d.Rating}`);

    // Populate genre filter dropdown
    const genres = [...new Set(data.map(d => d.Genre))];
    const dropdown = d3.select("#genreFilter");

    genres.forEach(genre => {
        dropdown.append("option")
            .attr("value", genre)
            .text(genre);
    });

    // Filter function
    dropdown.on("change", function () {
        const selectedGenre = this.value;
        circles.style("display", d => (selectedGenre === "All" || d.Genre === selectedGenre) ? "block" : "none");
    });
});
