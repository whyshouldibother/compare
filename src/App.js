import { useEffect, useRef } from "react";

import "./App.css";

let entities = [1, 2, 3, 4];

let set = [];
let index = 1;

let rank = [];

for (let i = 0; i < entities.length; i++) {
  for (let j = i + 1; j < entities.length; j++) {
    set = [...set, [entities[i], entities[j]]];
  }
}

function App() {
  const left = useRef(null);
  const right = useRef(null);
  const dom = useRef(null);
  useEffect(() => {
    left.current.innerText = set[0][0];
    right.current.innerText = set[0][1];
  }, []);

  function next(id: boolean) {
    rank = [...rank, set[index - 1].join(id ? "<" : ">")];
    if (index < set.length) {
      left.current.innerText = set[index][0];
      right.current.innerText = set[index][1];
      index++;
    } else if(dom.current.children.length<3) {
      const newChildDOMNode = dom.current.ownerDocument.createElement("div"); 
      newChildDOMNode.className = 'message'
      newChildDOMNode.appendChild(dom.current.ownerDocument.createTextNode("You have reached the end"))
      dom.current.appendChild(newChildDOMNode);
    }
  }

  return (
    <div ref={dom} className={"container"}>
      <div
        className="box left"
        onClick={() => {
          next(false);
        }}
        ref={left}
      ></div>
      <div
        className="box right"
        onClick={() => {
          next(true);
        }}
        ref={right}
      ></div>
    </div>
  );
}

export default App;
