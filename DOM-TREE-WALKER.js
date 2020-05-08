/**
 * "Virtual DOM-tree object using TreeWalker"
 * @author Mathias Picker
 *
 * GLOBAL SUPPORT: DOWN TO IE11 (https://caniuse.com/#feat=const)
 * Change out let/const for "var" to get support down to IE10
 *
 * MIT License
 *
 * Copyright (c) 2020 Mathias Picker
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Using the TreeWalker API (https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker) to loop through all the
 * DOM-elements in chronological order. Only nodes set to be accepted through the filter are nodeTypes 1 and 3 (https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType).
 */

const TREEWALKER = document.createTreeWalker(document, NodeFilter.SHOW_ALL, {
  acceptNode: function (node) {
    if (node.nodeType === 1 || (node.nodeType === 3 && node.nodeValue.trim().length !== 0)) {
      return NodeFilter.FILTER_ACCEPT;
    }
    return NodeFilter.FILTER_REJECT;
  },
});

const DOMTREE = [];

/**
 * Init the lastNode/DOMTREE with the TREEWALKER.currentNode (document)
 */

let lastNode = {
  NODE: TREEWALKER.currentNode,
  CHILDREN: [],
  /**
   * The TREEWALKER begins from document, so it shouldn't require the "ATTRIBUTES", "PARENT" or "SIBLINGS" properties.
   */
  // ATTRIBUTES: TREEWALKER.currentNode.attributes,
  // PARENT: {},
  // SIBLINGS: [],
};

DOMTREE.push(lastNode);

/**
 * Helper function for setting the siblings of an element.
 * Approach is to loop through the parents child, for each child take the list of the parents children, and then filter out the child itself.
 * Then we're left with a sibling-list for each child.
 * @param {Node} node
 */

function setSiblings(node) {
  /**
   * Using the good'ol classical for-loop to keep the support for older browsers.
   
  for (let i = 0; i < node.PARENT.CHILDREN.length; i++) {
    node.PARENT.CHILDREN[i].SIBLINGS = node.PARENT.CHILDREN.filter(function (node) {
      return node.NODE !== node.PARENT.CHILDREN[i].NODE;
    });
  }

   
  ES6 VERSION:
  */
  node.PARENT.CHILDREN.forEach((child) => {
    child.SIBLINGS = node.PARENT.CHILDREN.filter((node) => node.NODE !== child.NODE);
  });
}

while (true) {
  /**
   * Lets walk down the tree with our little TREEWALKER :)
   */
  let nextNode = TREEWALKER.nextNode();

  /**
   * Exit ouf of the while-loop when all of the nodes have been looped through.
   */
  if (!nextNode) break;

  const currentNode = {
    NODE: nextNode,
    ATTRIBUTES: nextNode.attributes,
    PARENT: {},
    CHILDREN: [],
    SIBLINGS: [],
  };

  /**
   * If the previous node (lastNode) is the parent of this one, then assign it as currentNodes parent and add currentNode to the lastNodes CHILDREN-list.
   */
  if (currentNode.NODE.parentNode === lastNode.NODE) {
    currentNode.PARENT = lastNode;
    lastNode.CHILDREN.push(currentNode);
  } else if (currentNode.NODE.parentNode === lastNode.NODE.parentNode) {
    /**
     * If the lastNode has same parent as currentNode then it's a sibling.
     * Give currentNode the same parent and add currentNode to its parent CHILDREN-list
     */
    currentNode.PARENT = lastNode.PARENT;
    currentNode.PARENT.CHILDREN.push(currentNode);
  } else {
    /**
     * If the lastNode was not a sibling or a parent of currentNode, then we know that the lastNode was the last sibling in its group (because the last check was the sibling-check).
     * Begin looping through the lastNodes parents children to find the sibling of the currentNode.
     */
    let temporaryNode = lastNode;

    while (true) {
      /**
       * For each iteration, set the siblings of the temporaryNode (on first iteration: lastNode | else: parent of the nodes we loop through)
       */
      setSiblings(temporaryNode);
      /**
       * The lastNode is a child in any DOM-group (don't know which yet).
       * We search up the DOM-tree until we find the parent that equals currentNodes sibling.
       * Then we add the temporaryNodes parent to the SIBLINGS list of currentNode and vise versa.
       * Lastly we set the parent of currentNode and also add the currentNode to its parent CHILDREN-list.
       */
      if (temporaryNode.PARENT.NODE === currentNode.NODE.previousElementSibling) {
        currentNode.SIBLINGS.push(temporaryNode.PARENT);
        temporaryNode.PARENT.SIBLINGS.push(currentNode);
        currentNode.PARENT = temporaryNode.PARENT.PARENT;
        currentNode.PARENT.CHILDREN.push(currentNode);
        setSiblings(currentNode);
        break;
      } else {
        /**
         * Go up one step and set the siblings of the the parent.
         */
        temporaryNode = temporaryNode.PARENT;
      }
    }
  }
  /**
   * Set the currentNode to the lastNode and prepare for another loop!
   */
  lastNode = currentNode;

  /**
   * Push to DOMTREE if a full list with each single element is wanted
   */
  // DOMTREE.push(currentNode);
}

console.log(DOMTREE);
