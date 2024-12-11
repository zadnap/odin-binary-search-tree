class Node {
  constructor(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }
}

class Tree {
  constructor(array) {
    const processedArray = this.#sortAndRemoveDuplicates(array);
    this.root = this.#buildTree(processedArray, 0, processedArray.length - 1);
  }

  #sortAndRemoveDuplicates(array) {
    const uniqueArray = [...new Set(array)];
    uniqueArray.sort((a, b) => a - b);
    return uniqueArray;
  }

  #buildTree(array, start, end) {
    if (start > end) return;

    const mid = start + Math.floor((end - start) / 2);
    const left = this.#buildTree(array, start, mid - 1);
    const right = this.#buildTree(array, mid + 1, end);
    const root = new Node(array[mid], left, right);

    return root;
  }

  insert(value) {
    let currentNode = this.root;

    if (!currentNode) {
      this.root = new Node(value);
    }

    while (currentNode) {
      if (value === currentNode.data) return;
      if (value > currentNode.data) {
        if (!currentNode.right) {
          currentNode.right = new Node(value);
          return;
        }
        currentNode = currentNode.right;
      } else {
        if (!currentNode.left) {
          currentNode.left = new Node(value);
          return;
        }
        currentNode = currentNode.left;
      }
    }
  }

  #getSuccessor(node) {
    let successor = node.right;
    let prevSuccessor = node;

    while (successor !== null && successor.left !== null) {
      prevSuccessor = successor;
      successor = successor.left;
    }

    return { prevSuccessor, successor };
  }

  deleteItem(value) {
    let currentNode = this.root;
    let prevNode = null;

    while (currentNode.data != value) {
      prevNode = currentNode;

      if (value > currentNode.data) {
        currentNode = currentNode.right;
      } else {
        currentNode = currentNode.left;
      }

      if (!currentNode) return;
    }

    if (currentNode.left && currentNode.right) {
      let { prevSuccessor, successor } = this.#getSuccessor(currentNode);

      if (!prevNode) {
        this.root = successor;
      } else if (prevNode.right === currentNode) {
        prevNode.right = successor;
      } else {
        prevNode.left = successor;
      }

      if (successor.right) {
        if (prevSuccessor.right === successor) {
          prevSuccessor.right = successor.right;
        } else {
          prevSuccessor.left = successor.right;
        }
      }

      successor.right = currentNode.right;
      successor.left = currentNode.left;
    } else if (currentNode.left && !currentNode.right) {
      if (!prevNode) {
        this.root = currentNode.left;
      } else if (prevNode.right === currentNode) {
        prevNode.right = currentNode.left;
      } else {
        prevNode.left = currentNode.left;
      }
    } else if (!currentNode.left && currentNode.right) {
      if (!prevNode) {
        this.root = currentNode.right;
      } else if (prevNode.right === currentNode) {
        prevNode.right = currentNode.right;
      } else {
        prevNode.left = currentNode.right;
      }
    } else {
      if (!prevNode) {
        this.root = null;
      } else if (prevNode.right === currentNode) {
        prevNode.right = null;
      } else {
        prevNode.left = null;
      }
    }
  }

  find(value) {
    let currentNode = this.root;

    while (currentNode.data != value) {
      if (value > currentNode.data) {
        currentNode = currentNode.right;
      } else {
        currentNode = currentNode.left;
      }

      if (!currentNode) return false;
    }

    return true;
  }

  levelOrder(callback) {
    if (!callback) {
      throw new Error("No Callback Provided !");
    }

    let currentNode = this.root;
    if (!currentNode) return;

    const queue = [currentNode];

    while (queue.length > 0) {
      currentNode = queue[0];
      callback(currentNode);

      queue.shift();
      if (currentNode.left) queue.push(currentNode.left);
      if (currentNode.right) queue.push(currentNode.right);
    }
  }

  inOrder(callback) {
    if (!callback) {
      throw new Error("No Callback Provided !");
    }

    let currentNode = this.root;
    if (!currentNode) return;

    const stack = [currentNode];

    while (stack.length > 0) {
      while (currentNode) {
        stack.push(currentNode);
        currentNode = currentNode.left;
      }

      currentNode = stack.pop();
      callback(currentNode);

      currentNode = currentNode.right;
    }
  }

  preOrder(callback) {
    if (!callback) {
      throw new Error("No Callback Provided !");
    }

    let currentNode = this.root;
    if (!currentNode) return;

    const stack = [currentNode];

    while (stack.length > 0) {
      currentNode = stack.pop();

      if (currentNode.right) stack.push(currentNode.right);
      if (currentNode.left) stack.push(currentNode.left);
      callback(currentNode);
    }
  }

  postOrder(callback) {
    if (!callback) {
      throw new Error("No Callback Provided !");
    }

    let currentNode = this.root;
    if (!currentNode) return;

    const stack1 = [currentNode];
    const stack2 = [];

    while (stack1.length > 0) {
      currentNode = stack1.pop();
      stack2.push(currentNode);

      if (currentNode.left) stack1.push(currentNode.left);
      if (currentNode.right) stack1.push(currentNode.right);
    }

    while (stack2.length > 0) {
      callback(stack2.pop());
    }
  }

  height(node) {
    if (!node) return -1;

    let leftHeight = this.height(node.left);
    let rightHeight = this.height(node.right);

    return 1 + Math.max(leftHeight, rightHeight);
  }

  depth(node) {
    let edges = 0;
    let currentNode = this.root;

    while (currentNode !== node) {
      edges++;
      if (node.data > currentNode.data) {
        currentNode = currentNode.right;
      } else {
        currentNode = currentNode.left;
      }
    }

    return edges;
  }

  isBalanced() {
    let balanced = true;

    this.levelOrder((node) => {
      let leftHeight = this.height(node.left);
      let rightHeight = this.height(node.right);
      if (Math.abs(leftHeight - rightHeight) > 1) balanced = false;
    });

    return balanced;
  }

  rebalance() {
    if (this.isBalanced()) return;

    const newArray = [];
    this.levelOrder((node) => {
      newArray.push(node.data);
    });

    const processedArray = this.#sortAndRemoveDuplicates(newArray);
    this.root = this.#buildTree(processedArray, 0, processedArray.length - 1);
  }

  prettyPrint(node = this.root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }
}

export default Tree;
