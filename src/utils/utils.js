/**
 * Javascript containing utility functions
 */

import { assertCondition } from "./assertion.js";

/** 
 * Checks if number is an integer > 0 & is a power of two
 * 
 * @param {number} num 
 * @returns {Boolean} true if num is a power of two
 */
function isBaseTwo(num) {
  if (!Number.isInteger(num) || num <= 0) {
    return false;
  }
  return (num & (num - 1)) === 0;
}

/** 
 * Creates 2D array.
 * 1 arguments -> Width = Height = Parameter
 * 2 arguments -> Parameter 1 => Width,
 *                Parameter 2 => Height.
 * 
 * @param  {...number} size representing the dimesion of the array ()
 * @returns {Array.<Array>} 2D array
 */
function create2DArray(...size){
  var grid = [];

  if(size.length === 1) {
    assertCondition(Number.isInteger(size[0]), "size is not an integer", size[0]);

    return create2DArray(size[0], size[0]);
  } else if (size.length === 2) {
    assertCondition(Number.isInteger(size[0]), "size is not an integer", size[0]); 
    assertCondition(Number.isInteger(size[1]), "size is not an integer", size[1]); 

    const height = size[0];
    const width = size[1];
    
    for (let i = 0; i < height; i++) {
      grid[i] = []; 
      for (let j = 0; j < width; j++) {
          grid[i][j] = `${i}${j}` + ":__"; 
      }
    }

    return grid;
  } else {
    throw new Error("Failed to create 2D array, too many arguments: " + size.length);
  }
}

export {
  isBaseTwo, 
  create2DArray
}