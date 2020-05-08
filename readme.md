### Virtual DOM-Tree using TreeWalker [0.88kb (876 bytes) minified / 0.66kb (655 bytes) gzipped]

This code creates a virtual DOM-TREE of the whole document using the TreeWalker API.

#### Fast copy:

```js
const T=document.createTreeWalker(document,NodeFilter.SHOW_ALL,{acceptNode:function(e){return 1===e.nodeType||3===e.nodeType&&0!==e.nodeValue.trim().length?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}}),DOMTREE=[];let l={NODE:T.currentNode,CHILDREN:[]};function setSiblings(e){e.PARENT.CHILDREN.forEach(E=>{E.SIBLINGS=e.PARENT.CHILDREN.filter(e=>e.NODE!==E.NODE)})}for(DOMTREE.push(l);;){let e=T.nextNode();if(!e)break;const E={NODE:e,ATTRIBUTES:e.attributes,PARENT:{},CHILDREN:[],SIBLINGS:[]};if(E.NODE.parentNode===l.NODE)E.PARENT=l,l.CHILDREN.push(E);else if(E.NODE.parentNode===l.NODE.parentNode)E.PARENT=l.PARENT,E.PARENT.CHILDREN.push(E);else{let e=l;for(;;){if(setSiblings(e),e.PARENT.NODE===E.NODE.previousElementSibling){E.SIBLINGS.push(e.PARENT),e.PARENT.SIBLINGS.push(E),E.PARENT=e.PARENT.PARENT,E.PARENT.CHILDREN.push(E),setSiblings(E);break}e=e.PARENT}}l=E}
```


**Tip:** Copy the code into the console and type in "DOMTREE" for instant demo