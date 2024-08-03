import { create2DArray } from "./utils/utils.js";
import { assertCondition } from "./utils/assertion.js";
import Node, { ON, OFF } from "./HashLife/node.js";

var aNode = new Node(1, [ON, OFF, ON, ON], 3, "XOXX");
var bigNode = new Node(2, [aNode, aNode, aNode, aNode], 12, "XOXXXOXXXOXXXOXX")
var bbNode = new Node(3, [bigNode, bigNode, bigNode, bigNode], 48, "XOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXX")
var cNode = new Node(4, [bbNode, bbNode, bbNode, bbNode], 192, "XOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXXXOXX");
var dNode = new Node(5, [cNode, cNode, cNode, cNode], 768, "smt")
bigNode.toGrid();
Node.join(aNode, aNode, aNode, aNode).toGrid();
Node.getZero(0).toGrid();
