if (!String.prototype.format) {
  String.prototype.format = () => {
    let args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

if (!Math.hypot) {
  Math.hypot = () => {
    let y = 0;
    let length = arguments.length;

    for (let i = 0; i < length; i++) {
      if (arguments[i] === Infinity || arguments[i] === -Infinity) {
        return Infinity;
      }
      y += arguments[i] * arguments[i];
    }
    return Math.sqrt(y);
  };
}

export function RandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

export function RandomRange(min, max, posNeg) {
  posNeg = posNeg || false;
  let result = Math.random() * (max - min) + min;
  result = Math.round(result * 100) / 100;

  if (!posNeg || Math.random() <= 0.5) {
    return result;
  } else {
    return -result;
  }
};

export function GenerateID(length) {
  length = length || 5;

  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

export function formatColor(color) {
  return "rgb({0}, {1}, {2})".format(
    color[0] || color['r'],
    color[1] || color['g'],
    color[2] || color['b']
  );
}

export function scale(start, end, percentage, round) {
  if (round === undefined) {
    round = true;
  }

  let scaledValue = start + ((end - start) * percentage);
  if (round) {
    return Math.round(scaledValue);
  } else {
    return scaledValue;
  }
}

export function HexToRGB(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function RGBToHex(color) {
  let componentToHex = function(x) {
    let hex = x.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  return "#" + componentToHex(color.r) + componentToHex(color.g) + componentToHex(color.b);
}