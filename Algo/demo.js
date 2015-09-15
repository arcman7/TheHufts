// var dataSet = [];
// for(var i=0; i<601; i++){
//   dataSet.push( 40+ (0.5 - Math.random()) );
// }

var a,b;
a = 69;
b = a + 8;
var oldSet = [];
var futureSet = [];
var entropyCollection = []; //the last value of this array wil always be the most current entropy state of the stock
var mappedEntropyCollection = [];


if(a>50){
  oldSet = stockData.slice(a-50,a);
}

if(b+50 < stockData.length){
  futureSet = stockData.slice(b,b+50)
}
var currentSet = stockData.slice(a,b);

if(entropyCollection.length >= currentSet.length){
  entropyCollection.shift();
  entropyCollection.push(relativeEntropy(currentSet));
  mappedEntropyCollection.shift();
  mappedEntropyCollection.push(mappedEntropy(relativeEntropy(currentSet)));
}
else{
  entropyCollection.push(relativeEntropy(currentSet));
  mappedEntropyCollection.push(mappedEntropy(relativeEntropy(currentSet)));
}

$(document).ready(function(){
  grapher();
  arrows();
})
$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
          if(a>0){
            a-=1;
            b-=1;
          }

          if(a>50){
            oldSet = stockData.slice(a-50,a);
          }

          if(b+50 < stockData.length){
           futureSet = stockData.slice(b,b+50)
          }

          currentSet = stockData.slice(a,b);
          if(entropyCollection.length >= currentSet.length){
            entropyCollection.pop();
            entropyCollection.unshift(relativeEntropy(currentSet));
            mappedEntropyCollection.pop();
            mappedEntropyCollection.unshift(mappedEntropy(relativeEntropy(currentSet)));
          }
          else{
            entropyCollection.unshift(relativeEntropy(currentSet));
            mappedEntropyCollection.unshift(mappedEntropy(relativeEntropy(currentSet)));

          }

          grapherUpdate();

        break;


        case 39: // right
          a+=1;
          b+=1;
          if(a>50){
            oldSet = stockData.slice(a-50,a);
          }

          if(b+50 < stockData.length){
           futureSet = stockData.slice(b,b+50)
          }

          currentSet = stockData.slice(a,b);
          currentSet = stockData.slice(a,b);

          if(entropyCollection.length >= currentSet.length){
            entropyCollection.shift();
            entropyCollection.push(relativeEntropy(currentSet));
            mappedEntropyCollection.shift();
            mappedEntropyCollection.push(mappedEntropy(relativeEntropy(currentSet)));
          }
          else{
            entropyCollection.push(relativeEntropy(currentSet));
            mappedEntropyCollection.push(mappedEntropy(relativeEntropy(currentSet)));
          }

          grapherUpdate();
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

arrows = function(){
  $("#forward").on('click',function(){
    console.log('forward');
    a+=1;
    b+=1;
    if(a>50){
      oldSet = stockData.slice(a-50,a);
    }

    if(b+50 < stockData.length){
     futureSet = stockData.slice(b,b+50)
    }

    currentSet = stockData.slice(a,b);
    currentSet = stockData.slice(a,b);

    if(entropyCollection.length >= currentSet.length){
      entropyCollection.shift();
      entropyCollection.push(relativeEntropy(currentSet));
    }
    else{
      entropyCollection.push(relativeEntropy(currentSet));
      mappedEntropyCollection.push(mappedEntropy(relativeEntropy(currentSet)));
    }

    grapherUpdate();
  });

  $("#backwards").on('click',function(){
    console.log('backwards');
    if(a>0){
      a-=1;
      b-=1;
    }

    if(a>50){
      oldSet = stockData.slice(a-50,a);
    }

    if(b+50 < stockData.length){
     futureSet = stockData.slice(b,b+50)
    }

    currentSet = stockData.slice(a,b);
    if(entropyCollection.length >= currentSet.length){
      entropyCollection.pop();
      entropyCollection.unshift(relativeEntropy(currentSet));
      mappedEntropyCollection.pop();
      mappedEntropyCollection.push(mappedEntropy(relativeEntropy(currentSet)));
    }
    else{
      entropyCollection.push(relativeEntropy(currentSet));
      mappedEntropyCollection.push(mappedEntropy(relativeEntropy(currentSet)));
    }

    grapherUpdate();
  });
}

grapher = function(){
  d3.select("#old").selectAll("div")
      .data(oldSet)  // <-- The answer is here!
      .enter()
      .append("div")
      .attr("class", "skinnybar")
      .style("height", function(d) {
          var barHeight = d * 4;
          return barHeight + "px";
  });

  d3.select("#current").selectAll("div")
      .data(currentSet)  // <-- The answer is here!
      .enter()
      .append("div")
      .attr("class", "bar")
      .style("height", function(d) {
          var barHeight = d * 4;
          return barHeight + "px";
  });

  d3.select("#future").selectAll("div")
      .data(futureSet)  // <-- The answer is here!
      .enter()
      .append("div")
      .attr("class", "skinnybar")
      .style("height", function(d) {
          var barHeight = d * 4;
          return barHeight + "px";
  });

  d3.select("#Entropy")//.transition()
      //.selectAll("div").each(function(d){ console.log(d)});
   .selectAll("div")
      .data(entropyCollection)  // <-- The answer is here!
      .enter()
      .append("div")
      .attr("class", "bar")
      .style("height", function(d) {
          var barHeight = d * 50;
          return barHeight + "px";
  });

  d3.select("#mappedEntropy")//.transition()
      //.selectAll("div").each(function(d){ console.log(d)});
   .selectAll("div")
      .data(mappedEntropyCollection)  // <-- The answer is here!
      .enter()
      .append("div")
      .attr("class", "bar")
      .style("height", function(d) {
          var barHeight = d * 50;
          return barHeight + "px";
  }).style("background-color", function(d) {
    if (d >= 0.8) {   //Threshold of 15
        return "green";
    } else if (0.8 >d && d > 0.3){
        return "yellow";
    }else if(d < 0.3){
      return "red";
    }
  });
}

grapherUpdate = function(){

  $("#old").html("");
  $("#current").html("");
  $("#future").html("");
  $("#entropy").html("");
  $("#mappedEntropy").html("");


  var svgOldUpdate = d3.select("#old")//.transition()
    .selectAll("div")//.each(function(d,i){ console.log(d)});
        .data(oldSet)  // <-- The answer is here!
       .enter()
       .append("div")
       .attr("class", "skinnybar")
       .style("height", function(d) {
           var barHeight = d * 4;
           return barHeight + "px";
   });

  var svgCurrentUpdate = d3.select("#current")//.transition()
      //.selectAll("div").each(function(d){ console.log(d)});

   .selectAll("div")
      .data(currentSet)  // <-- The answer is here!
      .enter()
      .append("div")
      .attr("class", "bar")
      .style("height", function(d) {
          var barHeight = d * 4;
          return barHeight + "px";
  });

  var svgFutureUpdate = d3.select("#future")//.transition()
      //.selectAll("div").each(function(d){ console.log(d)});
   .selectAll("div")
      .data(futureSet)  // <-- The answer is here!
      .enter()
      .append("div")
      .attr("class", "skinnybar")
      .style("height", function(d) {
          var barHeight = d * 4;
          return barHeight + "px";
  });

  var svgEntropyUpdate = d3.select("#Entropy")//.transition()
      //.selectAll("div").each(function(d){ console.log(d)});
   .selectAll("div")
      .data(entropyCollection)  // <-- The answer is here!
      .enter()
      .append("div")
      .attr("class", "bar")
      .style("height", function(d) {
          var barHeight = d * 50;
          return barHeight + "px";
  });

  var svgMappedEntropyUpdate = d3.select("#mappedEntropy")//.transition()
      //.selectAll("div").each(function(d){ console.log(d)});
   .selectAll("div")
      .data(mappedEntropyCollection)  // <-- The answer is here!
      .enter()
      .append("div")
      .attr("class", "bar")
      .style("height", function(d) {
          var barHeight = d * 50;
          return barHeight + "px";
  }).style("background-color", function(d) {
    if (d >= 0.8) {   //Threshold of 15
        return "green";
    } else if (0.8 >d && d > 0.3){
        return "yellow";
    }else if (d < 0.3){
      return "red";
    }
  });
    console.log(mappedEntropyCollection);

}


function relativeEntropy(array){
  var posCount = 0;
  var negCount = 0;
  array.forEach(function(price,index){
    if(price > array[index-1]){
      posCount++;
    }
    if(price < array[index-1]){
      negCount ++;
    }
  });
  var total = negCount + posCount;
  var posProbability = posCount / total;//array.length;
  var negProbability = negCount / total;//array.length;
  var entropy = -1*posProbability*Math.log(posProbability) + -1*negProbability*Math.log(negProbability);
  var entropyMax = 2*( -0.5*Math.log(0.5) ); // written this way for clarififcation
  //console.log(posProbability,negProbability);
  //console.log(entropyMax,entropy)
  return (entropy/entropyMax);
}

function mappedEntropy(X){
  return (1 - X*X)
}



