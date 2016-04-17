# ecaura
This application provides a visual experience for environmental reports. 

It is a single page application, which you can load by pointing your browser to the [model/index.html](model/index.html). If you don't have a localhost set up, you can quickly get one by running `python -m SimpleHTTPServer`. 

## Key Features
- Enter usage for water, electricity, waste, fuel, and food over time. 
- Visualize absolute values for these areas over time
- Visualize relative values (compared to others in industry) for these areas over time
- Real time updates. If another user adds a datapoint, the application will automatically update all relevant visualizations.

## Technologies Used
- HTML, Javascript, CSS, and JQuery for web work.
- D3 for charting.
- Polymer for formatting
- Firebase for backend, and for real-time updates.
