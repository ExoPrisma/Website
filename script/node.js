/**
 * Node class used for quadtree
 *  - lvl 0 -> single cell
 *  - lvl k -> 2 ^ (k + 1) cells
 */
class Node {
  
  /**
   * Takes a number of
   * @param {number} lvl lvl of the node
   * @param {Array} children array of children composing the node
   * @param {number} numCells number of cells present in the node
   * @param {string} hash hash representation of the node
   * 
   * @throws {Error} If lvl < 0, throws error
   */
  constructor(lvl, children, numCells, hash) {

    assertCondition(lvl >= 0, "lvl can only be positive integer", lvl);
    assertCondition(isInt(lvl), "lvl can only be integer");
    assertCondition(children.length >= 0, "children can only positive integer", children.length);
    assertCondition(children.length <= 4, "can only be 4 children", children.length);
    assertCondition(numCells >= 0, "numCells can only be positive integer", numCells);
    //Assert is a multiple of 2
    assertCondition(numCells);


    this.lvl = lvl;
    this.children = children;
    this.numCells = numCells;
    this.hash = hash;
  }
}