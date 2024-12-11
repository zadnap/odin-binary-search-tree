import { generateRandomNumberArray } from "./utils.mjs";
import Tree from "./binary-search-tree.mjs";

const array = generateRandomNumberArray(10);

const bst = new Tree(array);

console.log("Is Balanced:", bst.isBalanced());
console.log("Level Order:");
bst.levelOrder((node) => console.log(node.data));
console.log("Pre Order:");
bst.preOrder((node) => console.log(node.data));
console.log("Post Order:");
bst.postOrder((node) => console.log(node.data));
console.log("In Order:");
bst.inOrder((node) => console.log(node.data));
bst.insert(123);
bst.insert(456);
console.log("Is Balanced After Inserting:", bst.isBalanced());
bst.rebalance();
console.log("Is Balanced:", bst.isBalanced());
bst.prettyPrint();
