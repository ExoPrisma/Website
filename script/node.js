const utils = require("./utils");
const { assertCondition, assertEqual } = require("./assertion");
/**
 * Node class used for quadtree
 * 
 * @typedef {Object} Node
 * 
 * Properties:
 * 
 *  [lvl]
 *  Correspond to the lvl of the node in the quadtree
 *    - lvl 0 -> single cell ()
 *    - lvl k -> 2^k * 2^k cells
 * 
 *  [children]
 *  Subnode composing the node
 *    - 1st child -> Northwest quadrant
 *    - 2nd child -> Northeast quadrant
 *    - 3rd child -> Southwest quadrant
 *    - 4th child -> Southeast quadrant
 * 
 *  [numCells]
 *  Number of cells that are active
 * 
 *  [hash] 
 *  Hash representation of the node
 */
class Node {
  
  /**
   * Takes a number of parameters to create a Node.
   * @param {number} lvl lvl of the node
   * @param {Array} children array of children composing the node
   * @param {number} numCells number of active cells present in the node
   * @param {number} hash hash representation of the node
   * 
   * @throws {Error} If lvl < 0, throws error
   */
  constructor(lvl, children, numCells, hash) {

    assertCondition(lvl >= 0, "lvl can only be positive integer", lvl);
    assertCondition(Number.isInteger(lvl), "lvl can only be integer");
    assertCondition(children.length >= 0, "children can only positive integer", children.length);
    assertCondition(children.length <= 4, "can only be 4 children", children.length);
    assertCondition(numCells >= 0, "numCells can only be positive integer", numCells);
    assertCondition(numCells <= Math.pow((Math.pow(2, lvl)), 2), "numCells doesn't correspond to the lvl :" + lvl, numCells);

    this.lvl = lvl;
    this.children = children;
    this.numCells = numCells;
    this.hash = hash;
  }

  /**
   * Display the content of a node to a grid.
   */
  toGrid() {
    const size = Math.pow(2, this.lvl)
    const grid = utils.create2DArray(size);

    for (let i = 0; i < 4; i++) {
      let xRange = (i % 2 === 0) ? [0, size / 2 - 1] : [size / 2, size - 1];
      let yRange = (i < 2) ? [0, size / 2 - 1] : [size / 2, size - 1];

      this.children[i].toGridHelper(xRange, yRange, grid);
    }

    this.print(grid);
  }

  /**
   * Helper recursive method fill grid.
   * 
   * @param {number[]} row range of rows to be filled
   * @param {number[]} col range of columns to be filled
   * @param {Array.<Array>} grid grid to fill
   */
  toGridHelper(row, col, grid){
    if(row[0] == row[1] && col[0] == col[1]){
      assertCondition(this.lvl == 0, "Node level is not 0", this.lvl);

      const width = row[0];
      const height = col[0];
      if(this.numCells == 0){
        grid[height][width] = "O"
      }
      else {
        grid[height][width] = "X"
      } 
    }
    else{
      assertCondition((row[1] - row[0]) == (col[1] - col[0]), "The number of rows and columns are not equals", (row[1] - row[0]) - (col[1] - col[0]));

      const ranges = [
        { rStart: row[0], rEnd: row[1], cStart: col[0], cEnd: col[1] },  // Child 0
        { rStart: row[0], rEnd: row[1], cStart: col[0], cEnd: col[1] },  // Child 1
        { rStart: row[0], rEnd: row[1], cStart: col[0], cEnd: col[1] },  // Child 2
        { rStart: row[0], rEnd: row[1], cStart: col[0], cEnd: col[1] }   // Child 3
      ];

      for (let i = 0; i < 4; i++) {
        const rStart = ranges[i].rStart;
        const rEnd = ranges[i].rEnd;
        const cStart = ranges[i].cStart;
        const cEnd = ranges[i].cEnd;
        
        const rDiff = Math.floor((rEnd - rStart) / 2);
        const cDiff = Math.floor((cEnd - cStart) / 2);
        
        switch (i) {
            case 0:
                this.children[i].toGridHelper([rStart, rStart + rDiff], [cStart, cStart + cDiff], grid);
                break;
            case 1:
                this.children[i].toGridHelper([rEnd - rDiff, rEnd], [cStart, cStart + cDiff], grid);
                break;
            case 2:
                this.children[i].toGridHelper([rStart, rStart + rDiff], [cEnd - cDiff, cEnd], grid);
                break;
            case 3:
                this.children[i].toGridHelper([rEnd - rDiff, rEnd], [cEnd - cDiff, cEnd], grid);
                break;
            default:
                break;
        }
      }
    }
  }

  /**
   * Print the grid where each array are on the same line.
   * 
   * @param {Array.<Array>} grid representation of the node to be printed
   */
  print(grid) {
    grid.forEach(innerArray => {
      console.log(innerArray.join(' ')); 
  });
  }

}

// Static basic node
Node.ON = new Node(0, new Array(), 1, 1);
Node.OFF = new Node(0, new Array(), 0, 0);


module.exports = {
  Node,
}

var node = new Node(1, [Node.ON, Node.OFF, Node.ON, Node.ON], 3, "XOXX");
var bigNode = new Node(2, [node, node, node, node], 12, "XOXXXOXXXOXXXOXX")
var bbNode = new Node(3, [bigNode, bigNode, bigNode, bigNode], 48, "XOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXX")
var cNode = new Node(4, [bbNode, bbNode, bbNode, bbNode], 192, "XOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXX")
bbNode.toGrid();