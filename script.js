//Grafikler için Boyut ve Renk Farklılıklarının Sağlanması, Büyüğe Gittikçe Açık Renk
function randomArr(n){
  var returnArr = [];
  resetAnimation();
  for (var i=0; i<n; i++){
    returnArr.push(Math.floor(Math.random()*300+1));
  }
  return returnArr;
}

var varA = 80;
var varB = 25;
function updateScreen(arr, temp=false, grafikDiziLen=false){
  var htmlStr = "";
  var target = temp ? "#temp-grid" : "#grid-container";
  var arrLen = grafikDiziLen ? grafikDiziLen : arr.length;
  for (var i=0; i<arr.length; i++){
    htmlStr += '<div class="grid-element" id="bar'+i+'" style="height:' + arr[i]/(temp+1) + 'px; background-color: rgb('+Math.floor(arr[i]/1.40)+','+varB+','+varA+');"></div>';
  }
  $(target).css("grid-template-columns", "repeat("+arrLen+",1fr)");
  $(target).html(htmlStr);
}

//Önceden belirlenmiş Dizi Boyutları ve Animasyon Gecikmesi //
var grafikDizi;
var grafikDiziCopy;
var arrLength = 50;
var animDelay = 30;
$("#sayac-giris").change(() => {
  if ($("#sayac-giris").val() > 1000) $("#sayac-giris").val(1000);
  arrLength = $("#sayac-giris").val();
  updateGlobalArrays();
});
$("#anim-delay").change(() => {
  if ($("#anim-delay").val() < 0) $("#anim-delay").val(0);
  animDelay = $("#anim-delay").val();
});


function updateGlobalArrays(arr=undefined){
  grafikDizi = arr ? arr : randomArr(arrLength);
  grafikDiziCopy = [];
  for (var i = 0; i<grafikDizi.length; i++){
    grafikDiziCopy.push(grafikDizi[i]);
  }
  updateScreen(grafikDizi);
}

// Dizi girmek için gereken popup ekran düzenlemeleri // 

$("#dizi-giris").on("click", () => {
  $("#popup").css("display", "inherit");
});

$("#kapat-popup").on("click", () => {
  var rawinput = $("#arr-input").val();
  $("#popup").css("display", "none");
  var input = rawinput.match(/[0-9]+/g).map((x) => parseInt(x));
  var scale = 300/Math.max(...input);
  input = input.map((x) => x*scale);
  updateGlobalArrays(input);
});

updateGlobalArrays();
$("#rastgele").on("click", () => updateGlobalArrays());

function move(arr, old_index, new_index){
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
}

function resetAnimation(clearTemp=true){
  animIndex = 0;
  insertKs = [];
  insertIs = [];
  insertArrCopies = [];
  bubbleArrCopies = [];
  bubbleColors = [];
  if (clearTemp) updateScreen([], true);
  window.clearInterval(intervalId);
  console.log("Animation Completed");
}

// InsertionSort Algoritması ve Animasyonlar // 
var animIndex = 0;
var intervalId;
var insertIs = [];
var insertKs = [];
var insertArrCopies = [];
function insertionSort(arr){
  var tempArray;
	for (var i=1; i<arr.length; i++){
		for (var k=i-1; k>=0; k--){
      insertIs.push(i);
      insertKs.push(k);
      tempArray = [];
      for (var l=0; l<arr.length; l++){
        tempArray.push(arr[l]);
      }
      insertArrCopies.push(tempArray);
			if (arr[k] < arr[i]){
				move(arr,i,k+1);
				break;
			}
			if (k == 0){
				move(arr,i,0);
			}
		}
	}
	return arr;
}

function updateTree(arr){
  var numCols = 1;
	var counter = 0;
	for (var i=0; i<arr.length; i++){
		if (counter>=numCols){
			counter = 0;
			numCols*=2;
		}
		counter++;
	}
  
  var htmlStr = "";
  for (var i=0; i<arr.length; i++){
    htmlStr += '<div class="grid-element tree-element bar'+i+'" style="background-color: rgb('+Math.floor(arr[i]/1.57)+','+varB+','+varA+');"></div>';
  }
  $("#temp-grid").html(htmlStr);
  
  $("#temp-grid").css("grid-template-columns", "repeat("+numCols+",1fr)");
  $("#temp-grid").css("grid-gap", "2px");
  $(".tree-element").css("width", 100+"%");
  $(".tree-element").css("height", "50px");
  var num = 0;
  var den = numCols;
  var count = 1;
  var divisions = 1;
  while (true){
    try {
      $(".bar"+(count-1)).css("grid-column",(num+1)+" / "+(den+1));
      if (numCols/divisions + num >= numCols){
        num = 0;
        divisions = 2*(divisions);
        den = numCols/divisions;
      } else {
        num += numCols/divisions;
        den += numCols/divisions;
      }
      if (num == numCols-1) break;
      count++;
    } catch(err) {
      console.log(err);
      break;
    }
  }
}

function animHandlerInsert(){
  if (insertArrCopies[animIndex] == undefined){
    updateScreen(grafikDizi);
    resetAnimation();
    return;
  }
  updateScreen(insertArrCopies[animIndex]);
  $("#bar"+insertIs[animIndex]).css("background-color","#0081DA");
  $("#bar"+insertKs[animIndex]).css("background-color","#001421");
  animIndex++;
}

$("#insertion-sort").on("click", () => {
  insertionSort(grafikDizi);
  intervalId = window.setInterval(animHandlerInsert, animDelay);
});

