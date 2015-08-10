if (!String.prototype.format) {
  String.prototype.format = function() {
    let args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
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
  round = round || true;

  let scaledValue = start + ((end - start) * percentage);
  if (round) {
    return Math.round(scaledValue);
  } else {
    return scaledValue;
  }
}