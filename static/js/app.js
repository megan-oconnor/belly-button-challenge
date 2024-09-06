// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let md = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let sample_data = md.filter(samp => samp.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(sample_data).forEach(([key, value]) => {
      d3.select('#sample-metadata').append('h5').text(`${key}: ${value}`);
    });
    
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredSample = samples.filter((samp) => samp.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = filteredSample.otu_ids;
    let otu_labels = filteredSample.otu_labels;
    let sample_values = filteredSample.sample_values;

    // Build a Bubble Chart
    let trace_bubble = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids
      }
    }];

    let layout_bubble = {
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"},
      title: "Bacteria Cultures Per Sample"
    };
    
    // Render the Bubble Chart
    Plotly.newPlot("bubble", trace_bubble, layout_bubble);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let filtered_sample_values = sample_values.slice(0,10).reverse();
    let filtered_otu_ids = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
    let filtered_otu_labels = otu_labels.slice(0,10).reverse();

    // Build a Bar Chart
    let trace_bar = [{
      x: filtered_sample_values,
      y: filtered_otu_ids,
      text: filtered_otu_labels,
      type: "bar",
      orientation: "h"
    }];

    let layout_bar = {
      xaxis: {title: "Number of Bacteria"},
      title: "Top 10 Bacteria Cultures Found"
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", trace_bar, layout_bar);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sample_names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sample_names.forEach((sample) => {
      dropdown.append("option").text(sample).property("value",sample);
    });


    // Get the first sample from the list
    let samplefirst = sample_names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(samplefirst);
    buildMetadata(samplefirst);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();
