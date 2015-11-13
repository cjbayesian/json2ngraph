
var INPUTFILENAME = process.argv[2]; //'/Users/cchivers/Desktop/hx_similarity_graph.json';
var OUTDIR = process.argv[3]; // './hx_similarity_graph';


// Read in data from JSON
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync(INPUTFILENAME, 'utf8'));


// Init graph obj
var createGraph = require('ngraph.graph');
var g = createGraph();

// Load into ngraph obj 
g.beginUpdate();

// Add nodes
for (var i = 0; i < obj.nodes.length; i++) {
    console.log(obj.nodes[i].id);
    g.addNode(obj.nodes[i].id, obj.nodes[i]);
}

// Add links
for (var i = 0; i < obj.links.length; i++) {
    console.log(obj.links[i].source);
    g.addLink(obj.links[i].source, obj.links[i].target, obj.links[i]);
}

g.endUpdate(); // this triggers all listners of 'changed' event

// Print graph to screen
g.forEachNode(function(node){
    console.log(node.id, node.data);
});


// Create layout
var createLayout = require('ngraph.offline.layout');
// var layout = createLayout(g);

// run only 100 iterations
var layout = createLayout(g, {
  iterations: 1000, // Run `100` iterations only
  saveEach: 100, // Save each `10th` iteration
  outDir: OUTDIR, // Save results into `./myFolder`
  layout: require('ngraph.forcelayout3d') // use custom layouter
});
layout.run();


// Save to disk
var save = require('ngraph.tobinary');
save(g, {
  outDir: OUTDIR, // folder where to save results. '.' by default
  labels: 'labels.json', // name of the labels file. labels.json by default
  meta: 'meta.json', // name of the file with meta information. meta.json by default
  links: 'links.bin' // file name for links array. links.bin by default
});