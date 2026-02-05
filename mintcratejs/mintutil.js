// -----------------------------------------------------------------------------
// MintCrate - MintUtil
// A utility library for assorted helper functions
// -----------------------------------------------------------------------------

export let MintUtil = {};

MintUtil.randomChoice = function(...items) {
  return items[Math.floor(Math.random() * items.length)];
}

MintUtil.rgbToString = function(r, g, b, a = null) {
  if (a === null) {
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    return `rgb(${r}, ${g}, ${b}, ${a})`;
  }
}

MintUtil.getKeyByValue = function(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

MintUtil.deleteInCollection = function(item, collection) {
  let found = false;
  
  // Check if the item is in the current collection and delete if found
  if (Array.isArray(collection)) {
    let index = collection.findIndex((val) => val === item);
    if (index !== -1) {
      collection.splice(index, 1);
      found = true;
    }
  } else {
    let key = this.getKeyByValue(collection, item);
    if (key) {
      delete collection[key];
      found = true;
    }
  }
  
  // If not, then enter into any sub-collections and search through them
  if (!found) {
    for (const subCollection of Object.values(collection)) {
      found = this.deleteInCollection(item, subCollection);
      
      if (found) {
        break;
      }
    }
  }
  
  return found;
}


MintUtil.array = {};

MintUtil.array.moveItemLeft = function(arr, index) {
  if (index > 0 && index < arr.length) {
    let item = arr[index];
    arr.splice(index, 1);
    arr.splice(index - 1, 0, item);
  }
};

MintUtil.array.moveItemRight = function(arr, index) {
  if (index >= 0 && index < arr.length - 1) {
    let item = arr[index];
    arr.splice(index, 1);
    arr.splice(index + 1, 0, item);
  }
};

MintUtil.array.moveItemToStart = function(arr, index) {
  if (index > 0 && index < arr.length) {
    let item = arr[index];
    arr.splice(index, 1);
    arr.splice(0, 0, item);
  }
};

MintUtil.array.moveItemToEnd = function(arr, index) {
  if (index >= 0 && index < arr.length - 1) {
    let item = arr[index];
    arr.splice(index, 1);
    arr.push(item);
  }
};

MintUtil.imageData = {};

MintUtil.imageData.getColorAt = function(imageData, x, y) {
  const r = y * (imageData.width * 4) + x * 4;
  const g = r + 1;
  const b = r + 2;
  const a = r + 3;
  
  const color = [
    imageData.data[r],
    imageData.data[g],
    imageData.data[b],
    imageData.data[a],
  ];
  
  return color;
};