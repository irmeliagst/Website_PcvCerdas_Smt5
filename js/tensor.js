//  ----------- CANVAS ------------------
const canvas = document.getElementById("myCanvas");
const canvas2 = document.getElementById("Canvas2");
const chartContainer = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const ctx2 = canvas2.getContext("2d");

let isDrawing = false;
let lastX, lastY;
let model;
let touchInProgress = false;
let lastTouchX, lastTouchY;

// Faktor skala untuk menghitung posisi kursor di dalam canvas
const scale = canvas.width / canvas.clientWidth;

// ---------Touch--------

// Fungsi untuk menghandle awal sentuhan
function handleTouchStart(e) {
  if (e.touches.length === 1) {
    e.preventDefault(); // Mencegah scroll saat sentuhan
    touchInProgress = true;
    const touch = e.touches[0];
    lastTouchX = (touch.clientX - canvas.getBoundingClientRect().left) * scale;
    lastTouchY = (touch.clientY - canvas.getBoundingClientRect().top) * scale;
  }
}

// Fungsi untuk menghandle pergerakan sentuhan
function handleTouchMove(e) {
  if (!touchInProgress) return;
  const touch = e.touches[0];
  const touchX = (touch.clientX - canvas.getBoundingClientRect().left) * scale;
  const touchY = (touch.clientY - canvas.getBoundingClientRect().top) * scale;

  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";

  ctx.beginPath();
  ctx.moveTo(lastTouchX, lastTouchY);
  ctx.lineTo(touchX, touchY);
  ctx.stroke();

  lastTouchX = touchX;
  lastTouchY = touchY;
}

// Fungsi untuk menghandle akhir sentuhan
function handleTouchEnd(e) {
  touchInProgress = false;
}

// ---------Touch--------

// ctx2.globalAlpha = 0.5;
// ctx.globalAlpha = 1;
// Ubah warna latar belakang menjadi hitam
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

function startDrawing(e) {
  isDrawing = true;
  lastX = (e.offsetX || e.touches[0].clientX) * scale;
  lastY = (e.offsetY || e.touches[0].clientY) * scale;
}

function draw(e) {
  if (!isDrawing) return;
  const x = (e.offsetX || e.touches[0].clientX) * scale;
  const y = (e.offsetY || e.touches[0].clientY) * scale;

  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  // Ubah warna garis menjadi putih
  ctx.strokeStyle = "white";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  lastX = x;
  lastY = y;
}

function stopDrawing() {
  isDrawing = false;
}

function clearCanvas() {
  // Ubah warna latar belakang menjadi hitam
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  disableDrawing();
  clearChart();
}

// Tampilkan gambar di canvas setelah memilih file
const imageInput = document.getElementById("imageInput");
imageInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = e.target.result;
      disableDrawing();
    };
    reader.readAsDataURL(file);
  }
});

function disableDrawing() {
  canvas.removeEventListener("mousedown", startDrawing);
  canvas.removeEventListener("mousemove", draw);
  canvas.removeEventListener("mouseup", stopDrawing);
  canvas.removeEventListener("mouseleave", stopDrawing);

  canvas.removeEventListener("touchstart", handleTouchStart, false);
  canvas.removeEventListener("touchmove", handleTouchMove, false);
  canvas.removeEventListener("touchend", handleTouchEnd, false);
}

function enableDrawing() {
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  canvas.addEventListener("touchstart", handleTouchStart, false);
  canvas.addEventListener("touchmove", handleTouchMove, false);
  canvas.addEventListener("touchend", handleTouchEnd, false);
}

//  ----------- CANVAS ------------------

//  ----------- TENSOR FLOW ------------------

async function loadModel() {
  console.log("model loading..");

  // clear the model variable
  model = undefined;
  //   load the model using a HTTPS request (where you have stored your model files)
  model = await tf.loadLayersModel("js/model/model.json");

  // console.log(model);
  // console.log("model loaded..");
}

loadModel();

async function Generate() {
  var imageData = canvas.toDataURL();

  let tensor = preprocessCanvas(canvas);

  // make predictions on the preprocessed image tensor
  let predictions = await model.predict(tensor).data();
  // console.log(predictions);

  // get the model's prediction results
  let results = Array.from(predictions);
  // console.log(predictions)

  const data = {
    nama: results,
  };
  let index = findMaxValueAndIndex(results).maxIndex
  const hurufTerbesar = findLargestLetter(data);
  console.log(hurufTerbesar);
  // createChart(results);
  English(index - 1);
  showImage(index - 1);
}

async function Generate1() {
  var imageData = canvas.toDataURL();
  let tensor = preprocessCanvas(canvas);
  let predictions = await model.predict(tensor).data();
  let results = Array.from(predictions);
  const data = {
    nama: results,
  };
  let index = findMaxValueAndIndex(results).maxIndex
  const hurufTerbesar = findLargestLetter(data);
  console.log(hurufTerbesar);
  // createChart(results);
  Indonesia(index - 1);
  showImage(index - 1);
}


function English(index) {
  const English = ['A.mp3', 'B.mp3', 'C.mp3', 'D.mp3', 'E.mp3', 'F.mp3', 'G.mp3', 'H.mp3', 'I.mp3', 'J.mp3', 'K.mp3', 'L.mp3', 'M.mp3', 'N.mp3', 'O.mp3', 'P.mp3', 'Q.mp3', 'R.mp3', 'S.mp3', 'T.mp3', 'U.mp3', 'V.mp3', 'W.mp3', 'X.mp3', 'Y.mp3', 'Z.mp3']

  console.log(English[index])
  const sound = new Howl({
    src: ['sound/English/' + English[index]],
  });
  sound.play();
  window.onload = English;
}

function Indonesia(index) {
  const Indonesia = ['0.mp3', '1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3', '6.mp3', '7.mp3', '8.mp3', '9.mp3']

  console.log(Indonesia[index])
  const sound = new Howl({
    src: ['sound/Indonesia/' + Indonesia[index]],
  });
  sound.play();
  window.onload = Indonesia;
}

function findMaxValueAndIndex(arr) {
  let maxValue = -Infinity;
  let maxIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > maxValue) {
      maxValue = arr[i];
      maxIndex = i;
    }
  }

  return { maxValue, maxIndex };
}


function showImage(index) {
  const picture = ['A.png', 'B.png', 'C.png', 'D.png', 'E.png', 'F.png', 'G.png', 'H.png', 'I.png', 'J.png', 'K.png', 'L.png', 'M.png', 'N.png', 'O.png', 'P.png', 'Q.png', 'R.png', 'S.png', 'T.png', 'U.png', 'V.png', 'W.png', 'X.png', 'Y.png', 'Z.png']

  var img = new Image();
  // Set the source of the image
  img.src = `huruf/${picture[index]}`; // Replace with the actual path to your image

  // Wait for the image to load, then draw it on the canvas
  img.onload = function () {
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
    ctx2.drawImage(img, 0, 0, canvas2.width, canvas2.height);
  };
}

function findLargestLetter(data) {
  const huruf = ["0", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  const maxIndex = data.nama.indexOf(Math.max(...data.nama));
  const hurufTerbesar = huruf[maxIndex];

  return hurufTerbesar + " " + maxIndex;
}

function preprocessCanvas(image) {
  let tensor = tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([28, 28])
    .mean(2)
    .expandDims(2)
    .expandDims()
    .toFloat();
  console.log(tensor.shape);
  return tensor.div(255.0);
}


var myChart;

function createChart(predictionResults) {
  var ctx = document.getElementById("Canvas2").getContext("2d");

  var labels = [];
  var dataValues = [];

  for (var index = 1; index < predictionResults.length; index++) {
    if (predictionResults[index] > 0) {
      labels.push(String.fromCharCode(64 + index));
      dataValues.push(predictionResults[index]);
    }
  }

  var data = {
    labels: labels,
    datasets: [
      {
        label: "Grafik Huruf A-Z",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        data: dataValues,
      },
    ],
  };

  var options = {
    responsive: true,
    maintainAspectRatio: 0.25,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "bar",
    data: data,
    options: options,
  });
}

function clearChart() {
  var ctx = document.getElementById("Canvas2").getContext("2d");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (myChart) {
    myChart.destroy();
    myChart = null;
  }
}

// pop up
function openPopup() {
  document.getElementById("myPopup").style.display = "block";
  
}

// JavaScript untuk menutup popup
function closePopup() {
  document.getElementById("myPopup").style.display = "none";
}