$(function(){
  var the_height=500;
  if($(window).height() > the_height) the_height = $(window).height();
  var width = $(window).width();// - margin.left - margin.right;
  var height = the_height;// - margin.top - margin.bottom;


  var tiler = d3.geo.tile()
      .size([width, height]);

  var projection = d3.geo.mercator()
      .center([-122.41, 37.79])
      .scale((1 << 23) / 2 / Math.PI)
      .translate([width / 2, height / 2]);

  var path = d3.geo.path()
      .projection(projection);

  var svg = d3.select("#background1").append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(renderTiles, "highroad")
      .call(renderTiles, "buildings");

  function renderTiles(svg, type) {
    svg.append("g")
        .attr("class", type)
      .selectAll("g")
        .data(tiler
          .scale(projection.scale() * 2 * Math.PI)
          .translate(projection([0, 0])))
      .enter().append("g")
        .each(function(d) {
          var g = d3.select(this);
          d3.json("http://" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + ".tile.openstreetmap.us/vectiles-" + type + "/" + d[2] + "/" + d[0] + "/" + d[1] + ".json", function(error, json) {
            g.selectAll("path")
                .data(json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }))
              .enter().append("path")
                .attr("class", function(d) { return d.properties.kind; })
                .attr("d", path)
                //.attr("class", function(d) { if(type === 'buildings') return 'building';})
          });
        });
  }
});