// Retrieving selected image path from local storage
var environment = localStorage.getItem("environment");

//? KEY COLORS

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


var dict = {
  C: ut,
  G: sol,
  D: re,
  A: la,
  E: mi,
  B: si,
  Gb: sol_b,
  Db: re_b,
  Ab: la_b,
  Eb: mi_b,
  Bb: si_b,
  F: fa,
};


//! PALETTE EXTRACTION ------------------------------------------------------------------------------------------ //

//* PALETTE building

const buildPalette = (colorsList) => {
  const paletteContainer = document.getElementById("palette");
  
  // reset the HTML in case you load various images
  paletteContainer.innerHTML = "";

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
      }
    }

    // create the div and text elements for both colors & append it to the document
    const colorElement = document.createElement("div");
    colorElement.style.backgroundColor = hexColor;
    colorElement.appendChild(document.createTextNode(hexColor));
    paletteContainer.appendChild(colorElement);
  }
  
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
  for (let i = 0; i < imageData.length; i += 4) {
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
 * Calculate the color distance or difference between 2 colors
 *
 * further explanation of this topic
 * can be found here -> https://en.wikipedia.org/wiki/Euclidean_distance
 * note: this method is not accuarate for better results use Delta-E distance metric.
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

! MEDIAN CUT Algorithm:

* After building the rgb colors array we need to somehow know which colors are the most representative of the image, to obtain this we use color quantization.
* To achieve color quantization we are gonna use an algorithm called median-cut, the process is the following:

    1. Find the color channel (red, green or blue) in the image with the biggest range.
    2. Sort pixels by that channel.
    3. Divide the list in half.
    4. Repeat the process for each half until you have the desired number of colors.

* Now that we have the component with the biggest range of colors in it (R, G or B), sort it and then split it by half, using the two halves we repeat the same process and call the function again, each time adding a value to depth. (DEPTH means how many color we want by power of 2) */

//? QUANTIZATION

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
      reference = value.coords;
      min = diff;
    }
  };

  return [color_key, reference];
};



// Loading selected image in HTML canvas element + subsequent resizing 
var c = document.getElementById("imageBox");
var ctx = c.getContext("2d");
var img = new Image();


img.onload = function() {
  c.height = img.height/3.5;
  c.width = img.width/3.5;
  ctx.drawImage(img, 0, 0, img.width/3.5, img.height/3.5);
  ctx.imageSmoothingEnabled = false;

  /* *
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

  
  const fac = new FastAverageColor();
  avg = fac.getColor(img);
  avg = [avg.value[0], avg.value[1], avg.value[2]];

  const paletteContainer = document.getElementById("palette");
  const colorElement = document.createElement("div");
  colorElement.style.backgroundColor = "rgba(" + avg[0].toString() + ", " + avg[1].toString() + ", " + avg[2].toString() + ")";
  colorElement.style.float = "right";
  colorElement.appendChild(document.createTextNode("AVERAGE"));
  paletteContainer.appendChild(colorElement);

  document.getElementById("key").textContent = computeKey(avg)[0].toString();
  document.getElementById("key").style.color = "rgba(" + computeKey(avg)[1][0].toString() + ", " + computeKey(avg)[1][1].toString() + ", " + computeKey(avg)[1][2].toString() + ")";


}

img.src = environment.toString();

/*
 * getImageData returns an array full of RGBA values
 * each pixel consists of four values: the red value of the colour, the green, the blue and the alpha
 * (transparency). For array value consistency reasons,
 * the alpha is not from 0 to 1 like it is in the RGBA of CSS, but from 0 to 255.
*/

// Image color processing ===> extracting a COLOR PALETTE from the image
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



/* BACKGROUND -------------------------------------------------------------------------------------------------------------- */

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
  }
  
  function draw() {
    background(0);
    sp = map(mouseX, 0, width, 0,15);
    translate(width/2, height/2);
    for (let i = 0; i < stars.length; i++) { 
      stars[i].update();
      stars[i].show();
    }
  }
  
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
      // fill(255, 255, 150, 170);
      fill(255);
      noStroke();
      
      this.sx = map(this.x / this.z, 0, 1, 0, width);
      this.sy = map(this.y / this.z, 0, 1, 0, height);
      
      this.size = map(this.z,0,width,10,0); 
      ellipse(this.sx,this.sy,this.size,this.size);
    }
  }