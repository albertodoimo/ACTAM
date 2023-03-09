//? --------------------------> DECLARATION ZONE <-------------------------- ?//

// Retrieving selected image path from local storage
var environment = localStorage.getItem("environment");

var count = 0;  // color counter ----------> CHORD PROGRESSION
var ref;
var alpha_channel = [];

//! KEY COLORS
// Color.js ----> Color Objects
var ut = new Color("srgb", [255, 0, 0]);
var sol = new Color("srgb", [250, 120, 0]);
var re = new Color("srgb", [250, 250, 0]);
var la = new Color("srgb", [0, 255, 0]);
var mi = new Color("srgb", [190, 255, 255]);
var si = new Color("srgb", [50, 190, 250]);
var sol_b = new Color("srgb", [110, 60, 250]);
var re_b = new Color("srgb", [160, 0, 255]);
var la_b = new Color("srgb", [200, 125, 250]);
var mi_b = new Color("srgb", [255, 0, 0]);
var si_b = new Color("srgb",[150, 80, 120]);
var fa = new Color("srgb", [100, 0, 0]);

// Association of color object (Color.js) to key label via a DICTIONARY object
var dict = {  C: ut,  G: sol,  D: re,  A: la,  E: mi,  B: si,  Gb: sol_b,  Db: re_b,  Ab: la_b,  Eb: mi_b,  Bb: si_b,  F: fa,  };

// Extracted parameter dictionary

var param = { k: "", m: "", p: "", t: "" };

//! PALETTE & NUMBER OF COLORS (i.e. CHORD PROGRESSION)
const buildPalette = (colorsList) => {
  const paletteContainer = document.getElementById("palette");
  
  // reset the HTML in case you load various images
  paletteContainer.innerHTML = "";

  // The palette graphic representation contains the colors ORDERED BY LUMINANCE
  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_Colors_and_Luminance#light_and_luminance
  
  const orderedByColor = orderByLuminance(colorsList);

  for (let i = 0; i < orderedByColor.length; i++) {
    const hexColor = rgbToHex(orderedByColor[i]);

    if (i > 0) {
      const difference = calculateColorDifference(
        orderedByColor[i],
        orderedByColor[i - 1]
      );

      // if the distance is less than 120 we omit that color
      if (difference < 120) {
        continue;
      };
    };

    count++;

    // create the div and text elements for both colors & append it to the document
    const colorElement = document.createElement("div");
    colorElement.style.backgroundColor = hexColor;
    colorElement.appendChild(document.createTextNode(hexColor));
    paletteContainer.appendChild(colorElement);
  };
};

//  Convert each pixel value ( number ) to hexadecimal ( string ) with base 16
const rgbToHex = (pixel) => {
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };

  return (
    "#" +
    componentToHex(pixel.r) +
    componentToHex(pixel.g) +
    componentToHex(pixel.b)
  ).toUpperCase();
};

/** 
 * ? Convert HSL to Hex
 * this entire formula can be found in stackoverflow, credits to @icl7126 !!!
 * https://stackoverflow.com/a/44134328/17150245 
 */
const hslToHex = (hslColor) => {
  const hslColorCopy = { ...hslColor };
  hslColorCopy.l /= 100;
  const a =
    (hslColorCopy.s * Math.min(hslColorCopy.l, 1 - hslColorCopy.l)) / 100;
  const f = (n) => {
    const k = (n + hslColorCopy.h / 30) % 12;
    const color = hslColorCopy.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

/**
 * ! Convert RGB values to HSL
 * This formula can be found here 
 * https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
 */
const convertRGBtoHSL = (rgbValues) => {
  return rgbValues.map((pixel) => {
    let hue,
      saturation,
      luminance = 0;

    // first change range from 0-255 to 0 - 1
    let redOpposite = pixel.r / 255;
    let greenOpposite = pixel.g / 255;
    let blueOpposite = pixel.b / 255;

    const Cmax = Math.max(redOpposite, greenOpposite, blueOpposite);
    const Cmin = Math.min(redOpposite, greenOpposite, blueOpposite);

    const difference = Cmax - Cmin;

    luminance = (Cmax + Cmin) / 2.0;

    if (luminance <= 0.5) {
      saturation = difference / (Cmax + Cmin);
    } else if (luminance >= 0.5) {
      saturation = difference / (2.0 - Cmax - Cmin);
    }

    /**
     * If Red is max, then Hue = (G-B)/(max-min)
     * If Green is max, then Hue = 2.0 + (B-R)/(max-min)
     * If Blue is max, then Hue = 4.0 + (R-G)/(max-min)
     */
    const maxColorValue = Math.max(pixel.r, pixel.g, pixel.b);

    if (maxColorValue === pixel.r) {
      hue = (greenOpposite - blueOpposite) / difference;
    } else if (maxColorValue === pixel.g) {
      hue = 2.0 + (blueOpposite - redOpposite) / difference;
    } else {
      hue = 4.0 + (greenOpposite - blueOpposite) / difference;
    }

    hue = hue * 60; // find the sector of 60 degrees to which the color belongs

    // it should be always a positive angle
    if (hue < 0) {
      hue = hue + 360;
    }

    // When all three of R, G and B are equal, we get a neutral color: white, grey or black.
    if (difference === 0) {
      return false;
    }

    return {
      h: Math.round(hue) + 180, // plus 180 degrees because that is the complementary color
      s: parseFloat(saturation * 100).toFixed(2),
      l: parseFloat(luminance * 100).toFixed(2),
    };
  });
};

/**
 * * Using relative luminance we sort the colors in order of brightness
 * the fixed values and further explanation about this topic
 * can be found here -> https://en.wikipedia.org/wiki/Luma_(video)
 */
const orderByLuminance = (rgbValues) => {
  const calculateLuminance = (p) => {
    return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
  };

  return rgbValues.sort((p1, p2) => {
    return calculateLuminance(p2) - calculateLuminance(p1);
  });
};

// Looping on the imageData array to extract the rgb value of each pixel in a more readable way
const buildRgb = (imageData) => {
  const rgbValues = [];
  let c = 0;
  for (let i = 0; i < imageData.length; i += 4) {
    alpha_channel[c] = imageData[i + 3];
    c++;
    const rgb = {
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
    };
    rgbValues.push(rgb);
  }
  return rgbValues;
};

/**
 *! Calculate the color distance or difference between 2 colors
 *
 * further explanation of this topic
 * can be found here -> https://en.wikipedia.org/wiki/Euclidean_distance
 *? note: this method is not accurate: for better results, the Delta-E distance metric should be used, but for the purpose 
 *? of building the color palette the Euclidean distance is sufficient.
 */
const calculateColorDifference = (color1, color2) => {
  const rDifference = Math.pow(color2.r - color1.r, 2);
  const gDifference = Math.pow(color2.g - color1.g, 2);
  const bDifference = Math.pow(color2.b - color1.b, 2);

  return rDifference + gDifference + bDifference;
};

// returns what color channel has the biggest difference
const findBiggestColorRange = (rgbValues) => {
  /**
   * Min is initialized to the maximum value posible
   * from there we procced to find the minimum value for that color channel
   *
   * Max is initialized to the minimum value posible
   * from there we procced to fin the maximum value for that color channel
   */
  let rMin = Number.MAX_VALUE;
  let gMin = Number.MAX_VALUE;
  let bMin = Number.MAX_VALUE;

  let rMax = Number.MIN_VALUE;
  let gMax = Number.MIN_VALUE;
  let bMax = Number.MIN_VALUE;

  rgbValues.forEach((pixel) => {
    rMin = Math.min(rMin, pixel.r);
    gMin = Math.min(gMin, pixel.g);
    bMin = Math.min(bMin, pixel.b);

    rMax = Math.max(rMax, pixel.r);
    gMax = Math.max(gMax, pixel.g);
    bMax = Math.max(bMax, pixel.b);
  });

  const rRange = rMax - rMin;
  const gRange = gMax - gMin;
  const bRange = bMax - bMin;

  // determine which color has the biggest difference
  const biggestRange = Math.max(rRange, gRange, bRange);
  if (biggestRange === rRange) {
    return "r";
  } else if (biggestRange === gRange) {
    return "g";
  } else {
    return "b";
  }
};

/*

! MEDIAN CUT Algorithm:   @https://en.wikipedia.org/wiki/Median_cut#:~:text=Median%20cut%20is%20an%20algorithm,typically%20used%20for%20color%20quantization

* After building the rgb colors array we need to somehow know which colors are the most representative of the image, to obtain this we use color quantization.
* To achieve color quantization we are gonna use an algorithm called median-cut, the process is the following:

    1. Find the color channel (red, green or blue) in the image with the biggest range.
    2. Sort pixels by that channel.
    3. Divide the list in half.
    4. Repeat the process for each half until you have the desired number of colors.

* Now that we have the component with the biggest range of colors in it (R, G or B), sort it and then split it by half, using the two halves we repeat the same 
* process and call the function again, each time adding a value to depth. (DEPTH means how many color we want by power of 2)

*/
//! QUANTIZATION
const quantization = (rgbValues, depth) => {
  const MAX_DEPTH = 4;

  // BASE CASE: we enter it when our depth is equal to the MAX_DEPTH, in our case 4, then add up all the values and divide by half to get the average.

  if (depth === MAX_DEPTH || rgbValues.length === 0) {
    const color = rgbValues.reduce(
      (prev, curr) => {
        prev.r += curr.r;
        prev.g += curr.g;
        prev.b += curr.b;

        return prev;
      },
      {
        r: 0,
        g: 0,
        b: 0,
      }
    );

    color.r = Math.round(color.r / rgbValues.length);
    color.g = Math.round(color.g / rgbValues.length);
    color.b = Math.round(color.b / rgbValues.length);
    return [color];
  }

  // RECURSION
  const componentToSortBy = findBiggestColorRange(rgbValues);
  rgbValues.sort((p1, p2) => {
    return p1[componentToSortBy] - p2[componentToSortBy];
  });

  const mid = rgbValues.length / 2;
  return [
    ...quantization(rgbValues.slice(0, mid), depth + 1),
    ...quantization(rgbValues.slice(mid + 1), depth + 1),
  ];

};

//! KEY COMPUTATION
/* The function takes the avg = [r, g, b] array as an input and, by means of the Color.js library, computes the perceptive distance (Delta E algorithm, 2000 version) between the 
average color and each of the colors associated with the 12 keys according to Scriabin's "clavier à lumières" (https://it.wikipedia.org/wiki/Clavier_%C3%A0_lumi%C3%A8res), and returns the key corresponding to the minimum distance. */
const computeKey = (avg) => {
  let color1 = new Color({space: "srgb", coords: [avg[0], avg[1], avg[2]]});
  let min = color1.deltaE2000(dict.C);
  let color_key;
  let diff = [];
  let i = 0;

  for (const [key, value] of Object.entries(dict)) {
    diff = color1.deltaE2000(value);
    if (diff < min) {
      color_key = key;
      reference = value.coords; // reference is the RGB color code of the Scriabin's color associated with the returned key. The Color.js attribute ".coords" returns as an array the RGB coordinates of the color
      min = diff;
    }
  };
  return [color_key, reference];
};

//! MODE COMPUTAYION (BRIGHTNESS)
const isItDark = (imageData, c) => {
  var fuzzy = 0.1;
  var data = imageData.data;
  var r,g,b, max_rgb;
  var light = 0, dark = 0;

  for(let x = 0, len = data.length; x < len; x+=4) {
    r = data[x];
    g = data[x+1];
    b = data[x+2];

    max_rgb = Math.max(Math.max(r, g), b);
    if (max_rgb < 110)
      dark++;
    else
      light++;
  }

  var dl_diff = ((light - dark) / (c.width*c.height));
  if (dl_diff + fuzzy < 0)
    return true; /* Dark. */
  else
    return false;  /* Not dark. */
};

//! TETRAD SPECIES COMPUTATION (ALPHA CHANNEL)
const tetrad = (imageData, c) => {
  let data = imageData.data;
  let r,g,b, max_rgb;
  let light = 0;

  for(let x = 0, len = data.length; x < len; x+=4) {
    r = data[x];
    g = data[x+1];
    b = data[x+2];

    max_rgb = Math.max(Math.max(r, g), b);
    if (max_rgb >= 200)
      light++;
  }

  return (light / (c.width*c.height));
};


//? --------------------------> COMPUTATION ZONE <-------------------------- ?//

// Loading selected image in HTML canvas element + subsequent resizing 
var c = document.getElementById("imageBox");
var ctx = c.getContext("2d");
var img = new Image();

//* IMG.ONLOAD ------------> upon image correct loading, draws the image in the canvas and processes it
img.onload = function() {
  c.height = img.height/3.5;
  c.width = img.width/3.5;
  ctx.drawImage(img, 0, 0, img.width/3.5, img.height/3.5);
  ctx.imageSmoothingEnabled = false;  // 

  //! PALETTE
  /* *
       * getImageData returns an array full of RGBA values
       * each pixel consists of four values: the red value of the colour, the green, the blue and the alpha
       * (transparency). For array value consistency reasons,
       * the alpha is not from 0 to 1 like it is in the RGBA of CSS, but from 0 to 255.
  */
  const imageData = ctx.getImageData(0, 0, c.width, c.height);
  // Convert the image data to RGB values so it is much easier to work with
  const rgbArray = buildRgb(imageData.data);
  /**
   * Color quantization
   * A process that reduces the number of colors used in an image
   * while trying to visually maintin the original image as much as possible
   */
  const quantColors = quantization(rgbArray, 0);
  // Create the HTML structure to show the color palette
  buildPalette(quantColors);

  //! KEY
  // Fast Average Color Library ----> FastAverageColor Object
  const fac = new FastAverageColor();

  // FastAverageColor method "getColor()" returns img average color 
  avg = fac.getColor(img);

  // The returned color format is too complex, so we convert it to an array 
  avg = [avg.value[0], avg.value[1], avg.value[2]];

  localStorage.setItem("avg", avg); // save tha avg array color in local storage

  // Adding the AVG color to the palette (mimics the code seen in "buildPalette()")
  const paletteContainer = document.getElementById("palette");
  const colorElement = document.createElement("div");
  colorElement.style.backgroundColor = "rgba(" + avg[0].toString() + ", " + avg[1].toString() + ", " + avg[2].toString() + ")";
  colorElement.appendChild(document.createTextNode("AVERAGE"));
  paletteContainer.appendChild(colorElement);

  // Insert the key caption in the corresponding <div>. Note that computeKey() returns an array [color_key, reference]
  const comp_key = computeKey(avg);
  ref = comp_key[1];
  document.getElementById("key").textContent = comp_key[0].toString();
  document.getElementById("key").style.color = "rgba(" + comp_key[1][0].toString() + ", " + comp_key[1][1].toString() + ", " + comp_key[1][2].toString() + ")";

  if (comp_key[0] == 'C') {
    param.k = 0;
  } else if (comp_key[0] == 'Db') {
    param.k = 1;
  } else if (comp_key[0] == 'D') {
    param.k = 2;
  } else if (comp_key[0] == 'Eb') {
    param.k = 3;
  } else if (comp_key[0] == 'E') {
    param.k = 4;
  } else if (comp_key[0] == 'F') {
    param.k = 5;
  } else if (comp_key[0] == 'Gb') {
    param.k = 6;
  } else if (comp_key[0] == 'G') {
    param.k = 7;
  } else if (comp_key[0] == 'Ab') {
    param.k = 8;
  } else if (comp_key[0] == 'A') {
    param.k = 9;
  } else if (comp_key[0] == 'Bb') {
    param.k = 10;
  } else if (comp_key[0] == 'B') {
    param.k = 11;
  }


  //! BRIGHTNESS (MODE)
  const dark = isItDark(imageData, c);
  dark ? param.m = 0 : param.m = 1;

  // Insert the mode caption in the corresponding <div>
  dark ? document.getElementById("mode").textContent = "Minor" : document.getElementById("mode").textContent = "Major";
  // Mode caption styling
  if (dark)  {
    document.getElementById("mode").style.color = "black";
    document.getElementById("mode").style.textShadow = "white 1px 0 30px"
  }
  else document.getElementById("mode").style.textShadow = "rgba(" + avg[0].toString() + ", " + avg[1].toString() + ", " + avg[2].toString() + ") 1px 0 30px";

  //! TETRAD SPECIES
  if (tetrad(imageData, c) < 0.15) {
    param.t = 0;
    document.getElementById("tetrad").textContent = "Standard";
  } else {
    param.t = 1;
    document.getElementById("tetrad").textContent = "Seventh";
  }
  document.getElementById("tetrad").style.textShadow = "rgba(" + avg[0].toString() + ", " + avg[1].toString() + ", " + avg[2].toString() + ") 1px 0 30px";

  //! NUMBER OF COLORS in the palette (CHORD PROGRESSION COMPLEXITY)
  if (tetrad(imageData, c) * 100 * count < 100) {
    param.p = 5;
    document.getElementById("prog").textContent = "I - V";
  } else if (tetrad(imageData, c) * 100 * count > 101 && tetrad(imageData, c)* 100 * count < 200) {
    param.p = 4;
    document.getElementById("prog").textContent = "I - VI - IV";
  } else if (tetrad(imageData, c) * 100 * count > 201 && tetrad(imageData, c)* 100 * count < 300) {
    param.p = 3;
    document.getElementById("prog").textContent = "I - IV - VI - V";
  } else if (tetrad(imageData, c) * 100 * count > 301 && tetrad(imageData, c)* 100 * count < 400) {
    param.p = 2;
    document.getElementById("prog").textContent = "I - IV - II - V";
  } else if (tetrad(imageData, c) * 100 * count > 401) {
    param.p = 1;
    document.getElementById("prog").textContent = "I - V - VI - IV";
  }
  document.getElementById("prog").style.textShadow = "rgba(" + avg[0].toString() + ", " + avg[1].toString() + ", " + avg[2].toString() + ") 1px 0 30px";

  localStorage.setItem("k", param.k);
  localStorage.setItem("m", param.m);
  localStorage.setItem("p", param.p);
  localStorage.setItem("t", param.t);

};

// environment variable retrieval (i.e. the selected image path) and setting img source
img.src = environment.toString();

/* Image color processing ===> extracting a COLOR PALETTE from the image
 * getImageData returns an array full of RGBA values
 * each pixel consists of four values: the red value of the colour, the green, the blue and the alpha
 * (transparency). For array value consistency reasons,
 * the alpha is not from 0 to 1 like it is in the RGBA of CSS, but from 0 to 255.
*/
const imageData = ctx.getImageData(0, 0, c.width, c.height);

// Convert the image data to RGB values so its much simpler
const rgbArray = buildRgb(imageData.data);

/**
 * Color quantization
 * A process that reduces the number of colors used in an image
 * while trying to visually maintin the original image as much as possible
 */
const quantColors = quantization(rgbArray, 0);

// Create the HTML structure to show the color palette
buildPalette(quantColors);

//*? BACKGROUND -------------------------------------------------------------------------------------------------------------- //

let stars = [];
let sp;
  
function setup() {
    var canvas = createCanvas(windowWidth, Math.max(document.body.scrollHeight, document.documentElement.scrollHeight
        ));
    canvas.position(0,0);
    canvas.style('z-index', '-1');
    for (let i=0; i<1000; i++) {
      stars.push(new Star());
    }
};
  
function draw() {

    background(0);
    sp = map(mouseX, 0, width, 0,15);
    translate(width/2, height/2);
    for (let i = 0; i < stars.length; i++) { 
      stars[i].update();
      stars[i].show();
    }
};
  
class Star {
    
    constructor() {
      this.x = random(-width,width);
      this.y = random(-height,height);
      this.z = random(width);
    }
    
    update() {
      this.z = this.z - sp;
  
      if (this.z < 1) {
        this.z = width;
        this.x = random(-width,width);
        this.y = random(-height,height);
  
      }
    }
    
    show() {
      fill(ref[0], ref[1], ref[2]);
      noStroke();
      
      this.sx = map(this.x / this.z, 0, 1, 0, width);
      this.sy = map(this.y / this.z, 0, 1, 0, height);
      
      this.size = map(this.z,0,width,10,0); 
      ellipse(this.sx,this.sy,this.size,this.size);
    }
};