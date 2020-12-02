'use strict'
const simulationArea = document.getElementById('simulationArea');
const startButton = document.getElementById('simulationStart');
const stopButton = document.getElementById('simulationStop');
const resetButton = document.getElementById('resetMap')
const simulationState = document.getElementById('simulationState');
const sizeInput = document.getElementById('sizeChange');
const timesInput = document.getElementById('simulationTimes');
const inputError = document.getElementById('input-error');
const createGlider = document.getElementById('create-glider')

let size = 8;
let times = 100;
let map = [];
let simulationCount;
let simulationID;

window.onload = () => {
  makeMap()
  // simulationArea
}

/**
 * シミュレーションの盤面を作るための関数
 */
function makeMap() {
  map = [];
  let width = screen.width;
  for (let i = 0; i < size; i++) {
    const column = document.createElement('div');
    column.className = "column";
    simulationArea.appendChild(column);
    for (let j = 0; j < size; j++) {
      const f = document.createElement('div');
      f.className = "field";
      if (size > 10) {
        f.className = "field-min";
        let mapWidth = width * 0.8 < 500 ? width * 0.8 : 500;
        f.style.width = (mapWidth / size) + "px";
        f.style.height = f.style.width;
      }
      f.id = `f_${i * size + j}`
      f.onclick = () => change(i * size + j);
      // f.innerText = i;
      // simulationArea.appendChild(f);
      column.appendChild(f);
      map.push(0);
    }
  }
}

/**
 * clickされた要素の状態を切り替えるための関数
 * @param {number} num 
 */
function change(num) {
  let el = document.getElementById(`f_${num}`);
  el.classList.toggle("alive")
  map[num]++;
  map[num] %= 2;
}

/**
 * シミュレーションをスタートさせる
 */
startButton.onclick = () => {
  startButton.disabled = true;
  simulationCount = 0;
  simulationID = setInterval(() => {
    simulate();
    simulationCount++;
    simulationState.innerText = `シミュレーション中: ${simulationCount}/ ${times}`
    console.log(simulationCount);
    if (simulationCount >= times) {
      startButton.disabled = false;
      clearInterval(simulationID);
      simulationState.innerText = "待機中"
      console.log("end");
    }
  }, 500);
}

/**
 * シミュレーションを強制的に終了させる
 */
stopButton.onclick = () => {
  startButton.disabled = false;
  clearInterval(simulationID);
  simulationState.innerText = "待機中"
  console.log("end");
}

/**
 * 盤面をリセットする関数
 */
resetButton.onclick = () => {
  removeAllChildren(simulationArea);
  makeMap();
}

/**
 * 渡された値が左端の値であるかをcheck
 * @param {number} num 
 */
function checkLeft(num){
  if(num%size === 0){
    return true;
  }else{
    return false;
  }
}

/**
 * 渡された値が右端の値であるかをcheck
 * @param {number} num 
 */
function checkRight(num){
  if((num+1)%size === 0){
    return true;
  }else{
    return false;
  }
}

/**
 * lifeGameのシミュレーションを行うための関数
 */
function simulate() {
  let cnt;
  let el;
  const newmap = []
  for (let i = 0; i < size * size; i++) {
    el = document.getElementById(`f_${i}`);
    cnt = 0;

    // 左端右端の処理を追加
    cnt += ((i - size - 1 >= 0) && !checkRight(i-size-1)) ? map[i - size - 1] : 0;
    cnt += (i - size >= 0) ? map[i - size] : 0;
    cnt += ((i - size + 1 >= 0) && !checkLeft(i-size+1)) ? map[i - size + 1] : 0;


    cnt += ((i - 1 >= 0) && !checkRight(i-1)) ? map[i - 1] : 0;
    cnt += ((i + 1 < size * size) && !checkLeft(i+1)) ? map[i + 1] : 0;

    cnt += ((i + size - 1 < size * size) && !checkRight(i+size-1)) ? map[i + size - 1] : 0;
    cnt += (i + size < size * size) ? map[i + size] : 0;
    cnt += ((i + size + 1 < size * size) && !checkLeft(i+size+1)) ? map[i + size + 1] : 0;

    if (map[i] === 0) {
      if (cnt == 3) {
        el.classList.add('alive');
        newmap.push(1);
      } else {
        el.classList.remove('alive')
        newmap.push(0);
      }
    } else {
      if (cnt === 2 || cnt === 3) {
        el.classList.add('alive');
        newmap.push(1);
      } else {
        el.classList.remove('alive');
        newmap.push(0);
      }
    }
  }
  map = newmap;
}

/**
 * シミュレーションのサイズを変えたい時の処理
 */
sizeInput.onclick = () => {
  let inputsize = parseInt(sizeInput.value);
  if (!(inputsize > 3 && inputsize <= 50)) {
    inputError.innerText = "sizeは4以上50以下の半角整数で入力してください"
  } else {
    inputError.innerText = null;
  }
  sizeInput.value = inputsize;
  size = (inputsize > 3 && inputsize < 50) ? inputsize : size;
  removeAllChildren(simulationArea);
  makeMap();
}

/**
 * シミュレーションの最大回数を変更したい時の処理
 */
timesInput.onclick = () => {
  let inputTimes = parseInt(timesInput.value);
  if (!(inputTimes >= 10 && inputTimes <= 1000)) {
    inputError.innerText = "simulation回数は10以上1000以下の半角整数で入力してください"
  } else {
    inputError.innerText = null;
  }
  // 小数などが入力されているとき、自動でint型に戻して格納する
  timesInput.value = inputTimes;
  times = (inputTimes >= 10 && inputTimes <= 1000) ? inputTimes : times;
}

/**
 * lifeGameのシミュレーションのMapの大きさを入力中にenterを押した時の処理
 * @param {*} event 
 */
sizeInput.onkeydown = event => {
  if (event.key === 'Enter') {
    // TODO ボタンのonclick() 処理を呼び出す
    sizeInput.onclick();
  }
};

/**
 * シミュレーションの最大回数入力中にenterを押した時の処理
 * @param {*} event 
 */
timesInput.onkeydown = event => {
  if (event.key === 'Enter') {
    // timesInput ボタンのonclick() 処理を呼び出す
    timesInput.onclick();
  }
};

/**
 * グライダーを作成する
 */
function makeGlider() {
  map = [];
  let width = screen.width;
  for (let i = 0; i < size; i++) {
    const column = document.createElement('div');
    column.className = "column";
    simulationArea.appendChild(column);
    for (let j = 0; j < size; j++) {
      const f = document.createElement('div');
      f.className = "field";
      if (size > 10) {
        f.className = "field-min";
        let mapWidth = width * 0.8 < 500 ? width * 0.8 : 500;
        f.style.width = (mapWidth / size) + "px";
        f.style.height = f.style.width;
      }
      f.id = `f_${i * size + j}`
      f.onclick = () => change(i * size + j);
      column.appendChild(f);
      map.push(0);
    }
  }
  
  const gliderPosition = [1, size + 2, size * 2, size * 2 + 1, size * 2 + 2]
  for (let i = 0; i < gliderPosition.length; i++) {
    map[gliderPosition[i]] = 1;
    const el = document.getElementById(`f_${gliderPosition[i]}`)
    el.classList.add("alive");

  }
}

/**
 * グライダーボタンをクリックした時の処理
 */
createGlider.onclick = () => {
  removeAllChildren(simulationArea);
  makeGlider();
}

/**
 * 指定した要素の子どもを全て削除する
 * @param {HTMLElement} element HTMLの要素
 */
function removeAllChildren(element) {
  while (element.firstChild) {
    // 子どもの要素があるかぎり削除
    element.removeChild(element.firstChild);
  }
}
