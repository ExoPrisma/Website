import { LRUCache } from "lru-cache";

import { create2DArray } from "../utils/utils.js";
import { assertCondition } from "../utils/assertion.js";
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
  #lvl;
  #children;
  #numCells;
  #hash;

  // Cache for node
  static #cacheNode = new LRUCache({
      max: Math.pow(2, 24),
  });

  // Cache for empty node
  static #cacheEmpty = new LRUCache({
    max: 1024, 
  });

  // Cache for future generations
  static #cacheSuccessor = new LRUCache({
    max : Math.pow(2, 24), 
  })

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

    this.#lvl = lvl;
    this.#children = children;
    this.#numCells = numCells;
    this.#hash = hash;
  }

  /**
   * Display the content of a node to a grid.
   * Each cell is separated by an "-" vertically and a "|" horizontally. 
   *    Example:
   *          0 | 0 
   *          - - -
   *          0 | 0
   */
  toGrid() {
    if(this.#lvl == 0){
      Node.#print([[this.#hash]]);
    }
    else {
      const size = Math.pow(2, this.#lvl)
      const grid = create2DArray(size);

      for (let i = 0; i < 4; i++) {
        let xRange = (i % 2 === 0) ? [0, size / 2 - 1] : [size / 2, size - 1];
        let yRange = (i < 2) ? [0, size / 2 - 1] : [size / 2, size - 1];

        this.#children[i].#toGridHelper(xRange, yRange, grid);
      }

      Node.#print(grid);
    }
  }
  /**
   * Helper recursive method fill grid.
   * 
   * @param {number[]} row range of rows to be filled
   * @param {number[]} col range of columns to be filled
   * @param {Array.<Array>} grid grid to fill
   */
  #toGridHelper(row, col, grid){
    if(row[0] == row[1] && col[0] == col[1]){
      assertCondition(this.#lvl == 0, "Node level is not 0", this.#lvl);

      const width = row[0];
      const height = col[0];
      if(this.#numCells == 0){
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
                this.#children[i].#toGridHelper([rStart, rStart + rDiff], [cStart, cStart + cDiff], grid);
                break;
            case 1:
                this.#children[i].#toGridHelper([rEnd - rDiff, rEnd], [cStart, cStart + cDiff], grid);
                break;
            case 2:
                this.#children[i].#toGridHelper([rStart, rStart + rDiff], [cEnd - cDiff, cEnd], grid);
                break;
            case 3:
                this.#children[i].#toGridHelper([rEnd - rDiff, rEnd], [cEnd - cDiff, cEnd], grid);
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
  static #print(grid) {
    grid.forEach(innerArray => {
      console.log(innerArray.join('|')); 
      console.log("-".repeat(innerArray.length + (innerArray.length - 1)));
    });
  }

  /**
   * Join four together to create a node of a higher level. 
   * 
   * @param {Node} nwChild node in the North-West quadrant
   * @param {Node} neChild node in the North-East quadrant
   * @param {Node} swChild node in the South-West quadrant
   * @param {Node} seChild node in the South-East quadrant 
   * @returns a new node of higher level 
   */
  static join(nwChild, neChild, swChild, seChild){
    const cacheKey = `${nwChild.#hash}-${neChild.#hash}-${swChild.#hash}-${seChild.#hash}`;

    if (Node.#cacheNode.has(cacheKey)) {
      console.log("cache");
      return Node.#cacheNode.get(cacheKey);
    }

    const children = [nwChild, neChild, swChild, seChild];
    const numCells = children.reduce((sum, child) => sum + child.#numCells, 0);
    const hash = Node.#computeHash(nwChild, neChild, swChild, seChild);
    const newNode = new Node(nwChild.#lvl + 1, children, numCells, hash);

    Node.#cacheNode.set(cacheKey, newNode);

    return newNode;
  }
  /**
   * Compute hash value of new node.
   * 
   * @param {Node} nwChild node in the North-West quadrant
   * @param {Node} neChild node in the North-East quadrant
   * @param {Node} swChild node in the South-West quadrant
   * @param {Node} seChild node in the South-East quadrant 
   * @returns new node has value
   */
  static #computeHash(nwChild, neChild, swChild, seChild){
    // Ensure all hash values are BigInt
    const lvl = BigInt(nwChild.#lvl);
    const hash1 = BigInt(nwChild.#hash);
    const hash2 = BigInt(neChild.#hash);
    const hash3 = BigInt(swChild.#hash);
    const hash4 = BigInt(seChild.#hash);

    // Perform arithmetic operations with BigInt
    const hash = lvl 
                + 2n 
                + (5131830419411n * hash1) 
                + (3758991985019n * hash2)
                + (8973110871315n * hash3) 
                + 4318490180473n 
                + hash4;

    // Apply bitwise operation using BigInt
return hash & ((1n << 63n) - 1n);
  }

  /**
   * Returns an empty node.
   * 
   * @param {number} lvl of the empty node
   * @returns empty node
   */
  static getZero(lvl){
    const cacheKey = `${lvl}`;
    
    if (Node.#cacheEmpty.has(cacheKey)) {
      return Node.#cacheEmpty.get(cacheKey);
    }

    const kZeroNode = lvl == 0 ? OFF : Node.join(Node.getZero(lvl - 1), 
                                                 Node.getZero(lvl - 1), 
                                                 Node.getZero(lvl - 1), 
                                                 Node.getZero(lvl - 1));

    Node.#cacheEmpty.set(cacheKey, kZeroNode);
      return kZeroNode;
  }

  /**
   * Returns new node with node in the middle
   *    Example: 
   *                   0 | 0 | 0 | 0
   *                   - - - - - - -
   *          a | b    0 | a | b | 0
   *          - - - => - - - - - - -
   *          c | d    0 | c | d | 0
   *                   - - - - - - -
   *                   0 | 0 | 0 | 0
   * 
   * @param {Node} node at the center
   * @returns new node with node in the middle
   */
  static centre(node){
    const emptyNode = Node.getZero(node.#lvl - 1);
    const centerNode = join(
      join(emptyNode, emptyNode, emptyNode, node.#children[0]), 
      join(emptyNode, emptyNode, node.#children[1], emptyNode),
      join(emptyNode, node.#children[2], emptyNode, emptyNode), 
      join(node.#children[3], emptyNode, emptyNode, emptyNode)
    )

    return centerNode;
  }

  /**
   * Return the 2^{lvl-1} x 2^{lvl-1} successor, 2^{skip} generations in the future
   * 
   * @param {Node} node to calculate next generations
   * @param {number} skip number of generation in the future
   * @returns successor of node
   */
  static nextGeneration(node, skip=null){
    let nextGenNode;
    
    const cacheKey = `${node.#children[0].#hash}-${node.#children[1].#hash}-${node.#children[2].#hash}-${node.#children[3].#hash}`;
    
    if (Node.#cacheSuccessor.has(cacheKey)) {
      return Node.#cacheSuccessor.get(cacheKey);
    }

    if(node.#numCells == 0){
      nextGenNode = node.#children[0];
    }
    else if(node.#numCells == 2){
      nextGenNode = Node.#life4x4(node);
    }
    else{
      skip = (skip == null) ? node.#lvl - 2 : Math.min(skip, node.#lvl - 2);

      const nwNode = nextGeneration(join(node.#children[0].#children[0], node.#children[0].#children[1], node.#children[0].#children[2], node.#children[0].#children[3]), skip);
      const nNode = nextGeneration(join(node.#children[0].#children[1], node.#children[1].#children[0], node.#children[0].#children[3], node.#children[1].#children[2]), skip);
      const neNode = nextGeneration(join(node.#children[1].#children[0], node.#children[1].#children[1], node.#children[1].#children[2], node.#children[1].#children[3]), skip);
      const wNode = nextGeneration(join(node.#children[0].#children[2], node.#children[0].#children[3], node.#children[2].#children[0], node.#children[2].#children[1]), skip);
      const centerNode = nextGeneration(join(node.#children[0].#children[3], node.#children[1].#children[2], node.#children[2].#children[1], node.#children[3].#children[0]), skip);
      const eNode = nextGeneration(join(node.#children[1].#children[2], node.#children[1].#children[3], node.#children[3].#children[0], node.#children[3].#children[1]), skip);
      const swNode = nextGeneration(join(node.#children[2].#children[0], node.#children[2].#children[1], node.#children[2].#children[2], node.#children[2].#children[3]), skip);
      const sNode = nextGeneration(join(node.#children[2].#children[1], node.#children[3].#children[0], node.#children[2].#children[3], node.#children[3].#children[2]), skip);
      const seNode = nextGeneration(join(node.#children[3].children[0], node.#children[3].#children[1], node.#children[3].#children[2], node.#children[3].#children[3]), skip);

      if(skip < m.k - 2){
        nextGenNode = join(
          (join(nwNode.#children[3], nNode.#children[2], wNode.#children[1], centerNode.#children[0])),
          (join(nNode.#children[3], neNode.#children[2], centerNode.#children[1], eNode.#children[0])),
          (join(wNode.#children[3], centerNode.#children[2], swNode.#children[1], sNode.#children[0])),
          (join(centerNode.#children[3], eNode.#children[2], sNode.#children[1], seNode.#children[0])));
      }
      else{
        nextGenNode = join(
          nextGeneration(join(nwNode, nNode, wNode, centerNode), skip),
          nextGeneration(join(nNode, neNode, centerNode, swNode), skip),
          nextGeneration(join(wNode, centerNode, eNode, sNode), skip),
          nextGeneration(join(centerNode, swNode, sNode, seNode), skip));
      }
    }
    
    Node.#cacheSuccessor.set(cacheKey, nextGenNode)

    return nextGenNode;
  }
  /**
   * Base case, returns next generation of 4x4 nodes
   * 
   * @param {Node} node 4x4 
   * @returns 4x4 node for next generation
   */
  static #life4x4(node){
    assertCondition(node.#lvl == 2, "Node is not a 4x4 node", node.#lvl);

    const nwIndices = [[0, 0], [0, 1], [1, 0], [0, 2], [0, 4], [1, 2], [2, 0], [2, 1], [3, 0]];
    const neIndices = [[0, 1], [1, 0], [1, 1], [0, 3], [1, 2], [1, 3], [2, 1], [3, 0], [3, 1]];
    const swIndices = [[0, 2], [0, 3], [1, 2], [2, 0], [2, 1], [3, 0], [2, 2], [2, 3], [3, 2]];
    const seIndices = [[0, 3], [1, 2], [1, 3], [2, 1], [3, 0], [3, 1], [2, 3], [3, 2], [3, 3]];

    function getChildren(indices) {
      return indices.map(index => node.#children[index[0]].#children[index[1]]);
    }

    const nwChild = Node.#lifeRule(...getChildren(nwIndices));
    const neChild = Node.#lifeRule(...getChildren(neIndices));
    const swChild = Node.#lifeRule(...getChildren(swIndices));
    const seChild = Node.#lifeRule(...getChildren(seIndices));

    return join(nwChild, neChild, swChild, seChild);
  }
  /**
   * Calculated the outcome of cell in next generation using its surrounding
   * Currently implementing the basic Game of life rules:
   *    - A live cell dies if it has fewer than two live neighbors.
   *    - A live cell with two or three live neighbors lives on to the next generation.
   *    - A live cell with more than three live neighbors dies.
   *    - A dead cell will be brought back to live if it has exactly three live neighbors.
   * (Source: https://beltoforion.de/en/game_of_life/)
   * 
   * @param {Node} nw NorthWest node from node
   * @param {Node} n North node from node
   * @param {Node} ne NorthEast node from node
   * @param {Node} e East node from node
   * @param {Node} node that might be changing in the next generation
   * @param {Node} w West node from node
   * @param {Node} sw SouthWest node from node
   * @param {Node} s South node from node
   * @param {Node} se SouthEast node from node
   * @returns The outcome of node for next generation
   */
  static #lifeRule(nw, n, ne, e, node, w, sw, s, se){
    const sumOuterGrid = [nw, n, ne, e, w, sw, s, se].reduce((sumCell, currentNode) => sumCell + currentNode.#numCells, 0);

    return (node.#numCells && sumOuterGrid == 2) || sumOuterGrid == 3 ? ON : OFF;
  }

  /**
   * Find the nth successor of a given node
   * 
   * @param {Node} node 
   * @param {number} n 
   * @returns nth generation of node 
   */
  static advance(node, n){
    if(n == 0){
      return node;
    }

    let bits = [];
    while (n > 0) {
        bits.push(n & 1);
        n = n >> 1;
        node = Node.centre(node); 
    }

    bits.reverse();
    for (let k = 0; k < bits.length; k++) {
        const bit = bits[k];
        const j = bits.length - k - 1;
        if (bit) {
            node = Node.successor(node, j);
        }
    }

    return node;
  }

  /**
   * Fast generation of nth generation of node
   * 
   * @param {Node} node 
   * @param {number} n 
   * @returns nth generation of node
   */
  static fastForward(node, n){
    for(let i = 0; i < n; i++){
      while(node.#lvl < 3 |
            node.#children[0].#numCells != node.#children[0].#children[3].#children[3].#numCells | 
            node.#children[1].#numCells != node.#children[1].#children[2].#children[2].#numCells |
            node.#children[2].#numCells != node.#children[2].#children[1].#children[1].#numCells |
            node.#children[3].#numCells != node.#children[3].#children[0].#children[0].#numCells ){
              node = Node.centre(node)
      } 
      node = Node.nextGeneration(node);
    }
    return node;
  }

  /**
  * Turn a quadtree into a list of (x,y,gray) triples 
  * in the rectangle (x,y) -> (clip[0], clip[1], clip[2], clip[3]) (if clip is not null).
  * If `level` is given, quadtree elements at the given level are given 
  * as a grayscale level 0.0->1.0, "zooming out" the display.
  * 
  * @param {Object} node - The root node of the quadtree.
  * @param {number} [x=0] - The x-coordinate of the current node.
  * @param {number} [y=0] - The y-coordinate of the current node.
  * @param {number[]} [clip=null] - The clipping rectangle as [x_min, x_max, y_min, y_max].
  * @param {number} [level=0] - The level at which to collect grayscale levels.
  * @returns {Array} A list of (x, y, gray) triples within the clipping rectangle.
  */
  static expand(node, x = 0, y = 0, clip = null, lvl = 0){
    if (node.#numCells === 0) {
      return [];
    }

    const size = 1 << node.#lvl;

    if (clip !== null) {
      if (x + size < clip[0] || x > clip[1] || 
          y + size < clip[2] || y > clip[3]) {
          return [];
      }
    }

    if (node.#lvl === lvl) {
      const gray = node.#numCells / (size * size);
      return [[x >> lvl, y >> lvl, gray]];
    }
    else{
      const offset = size >> 1;
        return [
            ...expand(node.#children[0], x, y, clip, lvl),
            ...expand(node.#children[1], x + offset, y, clip, lvl),
            ...expand(node.#children[2], x, y + offset, clip, lvl),
            ...expand(node.#children[3], x + offset, y + offset, clip, lvl)
      ];
    }
  }

  /**
  * Turn a list of (x, y) coordinates into a quadtree.
  * 
  * @param {Array} pts - A list of (x, y) coordinate pairs.
  * @returns {Object} The root node of the constructed quadtree.
  */
  static construct(pts){
    let minX = Math.min(...pts.map(([x, y]) => x));
    let minY = Math.min(...pts.map(([x, y]) => y));
    let pattern = new Map(pts.map(([x, y]) => [[x - minX, y - minY], 'on']));
    let k = 0;

    while (pattern.size !== 1) {
      let nextLevel = new Map();
      let z = getZero(k);

      while (pattern.size > 0) {
          let [x, y] = pattern.keys().next().value;
          x = x - (x & 1);
          y = y - (y & 1);

          let a = pattern.get([x, y]) || z;
          pattern.delete([x, y]);
          let b = pattern.get([x + 1, y]) || z;
          pattern.delete([x + 1, y]);
          let c = pattern.get([x, y + 1]) || z;
          pattern.delete([x, y + 1]);
          let d = pattern.get([x + 1, y + 1]) || z;
          pattern.delete([x + 1, y + 1]);
          
          nextLevel.set([x >> 1, y >> 1], join(a, b, c, d));
      }

      pattern = nextLevel;
      k += 1;
    }

    return Array.from(pattern.values())[0];
  }
}

// Static basic node
const ON = new Node(0, new Array(), 1, 1);
const OFF = new Node(0, new Array(), 0, 0);

export default Node;
export { ON, OFF };
