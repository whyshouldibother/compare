import { useRef, useState } from "react";
import ReactDOM from "react-dom/server";
import styles from "../css/compare.module.css";

async function getCount(api) {
  const request = await fetch(`${api}/api/count?id=1`);
  const response = await request.json();
}

const api = process.env.REACT_APP_API_ENDPOINT;

const entities = Array.from({ length: 6 }, (_, i) => i);
let score = Array(entities.length).fill(0);
let set = [];
let index = 0;

let rank = [];

for (let i = 0; i < entities.length; i++) {
  for (let j = i + 1; j < entities.length; j++) {
    set = [...set, [entities[i], entities[j]]];
  }
}

function Compare() {
  const dom = useRef(null);
  let entityLeft = set[0][0];
  let entityRight = set[0][1];

  const [leftImg, setLeftImg] = useState(`${api}/api/img/?id=${entityLeft}`);
  const [rightImg, setRightImg] = useState(`${api}/api/img/?id=${entityRight}`);

  function next(id: boolean) {
    if (index < set.length) {
      rank = [...rank, set[index].join(id ? "<" : ">")];
      if (id) {
        score[set[index][0]]--;
        score[set[index][1]]++;
      } else {
        score[set[index][0]]++;
        score[set[index][1]]--;
      }
      index++;
      if (index < set.length) {
        entityLeft = set[index][0];
        entityRight = set[index][1];
        setLeftImg(`${api}/api/img?id=${entityLeft}`);
        setRightImg(`${api}/api/img?id=${entityRight}`);
      }
    } else if (dom.current.children.length < 3) {
      let min = [0, 0, 0],
        minIndex = [0, 0, 0],
        max = [0, 0, 0],
        maxIndex = [0, 0, 0];

      for (let i = 0; i < entities.length; i++) {
        if (min[0] >= score[i]) {
          min[2] = min[1];
          min[1] = min[0];
          min[0] = score[i];
          minIndex[2] = minIndex[1];
          minIndex[1] = minIndex[0];
          minIndex[0] = i;
        } else if (min[1] >= score[i]) {
          min[2] = min[1];
          min[1] = score[i];
          minIndex[2] = minIndex[1];
          minIndex[1] = i;
        } else if (min[2] >= score[i]) {
          min[2] = score[i];
          minIndex[2] = i;
        }
        if (max[0] <= score[i]) {
          max[2] = max[1];
          max[1] = max[0];
          max[0] = score[i];
          maxIndex[2] = maxIndex[1];
          maxIndex[1] = maxIndex[0];
          maxIndex[0] = i;
        } else if (min[1] <= score[i]) {
          max[2] = max[1];
          max[1] = score[i];
          maxIndex[2] = maxIndex[1];
          maxIndex[1] = i;
        } else if (min[2] <= score[i]) {
          max[2] = score[i];
          maxIndex[2] = i;
        }
        console.log(minIndex, maxIndex);
      }

      const Report = (
        <>
          <h2>Thanks for completing the survery</h2>
          <h4>Top 3</h4>
          <div className={styles.smallImgContainer}>
            <img
              src={`${api}/api/img?id=${maxIndex[0]}`}
              className={styles.smallImg}
            />
            <img
              src={`${api}/api/img?id=${maxIndex[1]}`}
              className={styles.smallImg}
            />
            <img
              src={`${api}/api/img?id=${maxIndex[2]}`}
              className={styles.smallImg}
            />
          </div>
          <h4>Bottom 3</h4>
          <div className={styles.smallImgContainer}>
            <img
              src={`${api}/api/img?id=${minIndex[0]}`}
              className={styles.smallImg}
            />
            <img
              src={`${api}/api/img?id=${minIndex[1]}`}
              className={styles.smallImg}
            />
            <img
              src={`${api}/api/img?id=${minIndex[2]}`}
              className={styles.smallImg}
            />
          </div>
        </>
      );

      const newChildDOMNode = dom.current.ownerDocument.createElement("div");
      newChildDOMNode.className = styles.message;
      newChildDOMNode.innerHTML = ReactDOM.renderToString(Report);
      dom.current.appendChild(newChildDOMNode);
      async function post() {
        const request = await fetch(`${api}/api/compare/`);
        const response = await request.json();
      }

      post();
    }
  }

  return (
    <div ref={dom} className={styles.container}>
      <div className={`${styles.box} ${styles.left}`}>
        <img
          src={leftImg}
          alt={"Loading..."}
          onClick={() => {
            next(false);
          }}
          className = {styles.bigImg}
        />
      </div>
      <div className={`${styles.box} ${styles.right}`}>
        <img
          src={rightImg}
          alt={"Loading..."}
          onClick={() => {
            next(true);
          }}
          className = {styles.bigImg}
        />
      </div>
    </div>
  );
}

export default Compare;
