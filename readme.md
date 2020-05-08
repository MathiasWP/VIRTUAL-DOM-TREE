### Virtual DOM-Tree using TreeWalker [0.94kb (944 bytes) minified / 0.67kb (666 bytes) gzipped]

This code creates a virtual DOM-TREE of the whole document using the TreeWalker API.

#### Fast copy:

```js
const T=document.createTreeWalker(document,NodeFilter.SHOW_ALL,{acceptNode:function(e){return 1===e.nodeType||3===e.nodeType&&0!==e.nodeValue.trim().length?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}}),DOMTREE=[];let l={NODE:T.currentNode,CHILDREN:[]};function setSiblings(e){for(let N=0;N<e.PARENT.CHILDREN.length;N++)e.PARENT.CHILDREN[N].SIBLINGS=e.PARENT.CHILDREN.filter((function(e){return e.NODE!==e.PARENT.CHILDREN[N].NODE}))}for(DOMTREE.push(l);;){let e=T.nextNode();if(!e)break;const N={NODE:e,ATTRIBUTES:e.attributes,PARENT:{},CHILDREN:[],SIBLINGS:[]};if(N.NODE.parentNode===l.NODE)N.PARENT=l,l.CHILDREN.push(N);else if(N.NODE.parentNode===l.NODE.parentNode)N.PARENT=l.PARENT,N.PARENT.CHILDREN.push(N);else{let e=l;for(;;){if(setSiblings(e),e.PARENT.NODE===N.NODE.previousElementSibling){N.SIBLINGS.push(e.PARENT),e.PARENT.SIBLINGS.push(N),N.PARENT=e.PARENT.PARENT,N.PARENT.CHILDREN.push(N),setSiblings(N);break}e=e.PARENT}}l=N}
```


**Tip:** Copy the code into the console and type in "DOMTREE" for instant demo.