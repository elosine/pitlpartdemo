// GLOBAL VARIABLES ---------------------------------------------------- //
// TIMING & ANIMATION ENGINE /////////////////////////////
var FRAMERATE = 60.0;
var MSPERFRAME = 1000.0 / FRAMERATE;
var SECPERFRAME = 1.0 / FRAMERATE;
var PXPERSEC = 360.0;
var PXPERMS = PXPERSEC / 1000.0;
var PXPERFRAME = PXPERSEC / FRAMERATE;
var framect = 0;
var delta = 0.0;
var lastFrameTimeMs = 0.0;
var pieceClock = 0.0;
var clockadj = 0.0;
// COLORS /////////////////////////////////////////////////
var clr_neonMagenta = new THREE.Color("rgb(255, 21, 160)");
var clr_neonBlue = new THREE.Color("rgb(6, 107, 225)");
var clr_forest = new THREE.Color("rgb(11, 102, 35)");
var clr_jade = new THREE.Color("rgb(0, 168, 107)");
var clr_neonGreen = new THREE.Color("rgb(57, 255, 20)");
var clr_limegreen = new THREE.Color("rgb(153, 255, 0)");
var clr_yellow = new THREE.Color("rgb(255, 255, 0)");
var clr_orange = new THREE.Color("rgb(255, 128, 0)");
var clr_red = new THREE.Color("rgb(255, 0, 0)");
var clr_purple = new THREE.Color("rgb(255, 0, 255)");
var clr_neonRed = new THREE.Color("rgb(255, 37, 2)");
var clr_safetyOrange = new THREE.Color("rgb(255, 103, 0)");
var clr_green = new THREE.Color("rgb(0, 255, 0)");
// SCENE /////////////////////////////////////////////////
var CANVASW = 950;
var CANVASH = 600;
var RUNWAYLENGTH = 2400;
var camera, scene, renderer, canvas;
// STATUS BAR ///////////////////////////////////////////
var sb = true;
var statusbar = document.getElementById('statusbar');
// GO FRET /////////////////////////////////////////////
var TRDISTFROMCTR = 200;
var TRDISTFROMCTR = 0;
var GOFRETLENGTH = 50;
var GOFRETHEIGHT = 14;
var GOFRETPOSZ = -GOFRETLENGTH / 2;
var GOFRETWIDTH = 500;
var goFretLMatl = new THREE.MeshLambertMaterial({
  color: clr_neonGreen
});
var goFretRMatl = new THREE.MeshLambertMaterial({
  color: clr_neonGreen
});
var goFretGeom = new THREE.CubeGeometry(GOFRETWIDTH, GOFRETHEIGHT, GOFRETLENGTH);
var goFretBigGeom = new THREE.CubeGeometry(GOFRETWIDTH + 5, GOFRETHEIGHT + 5, GOFRETLENGTH + 5);
var goFretL, goFretR;
// EVENT GO /////////////////////////////////////////////
var EVENTGOLENGTH = 40;
var EVENTGOHEIGHT = 17;
var EVENTGOPOSZ = -18;
var EVENTGOWIDTH = 130;
var eventGoLMatl = new THREE.MeshLambertMaterial({
  color: clr_neonGreen
});
var eventGoRMatl = new THREE.MeshLambertMaterial({
  color: clr_neonGreen
});
var eventGoGeom = new THREE.CubeGeometry(EVENTGOWIDTH, EVENTGOHEIGHT, EVENTGOLENGTH);
var eventGoBigGeom = new THREE.CubeGeometry(EVENTGOWIDTH + 5, EVENTGOHEIGHT + 5, EVENTGOLENGTH + 5);
var eventGoL, eventGoR;
// TEMPO FRETS ///////////////////////////////////////////////
var TEMPOFRETLENGTH = 50;
var TEMPOFRETHEIGHT = 15;
var TEMPOFRETWIDTH = GOFRETWIDTH;
var tempoFretMatl = new THREE.MeshLambertMaterial({
  color: "rgb(255,103,0)"
});
var tempoFretGeom = new THREE.CubeGeometry(TEMPOFRETWIDTH, TEMPOFRETHEIGHT, TEMPOFRETLENGTH);
var tempoFretIx = 0;
var eventSectionL, eventSectionR;
var goFretTimerL = 0;
var goFretTimerR = 0;
// EVENTS ///////////////////////////////////////////////
var eventMatl = new THREE.MeshLambertMaterial({
  color: clr_neonGreen
});
var eventGeom = new THREE.CubeGeometry(EVENTGOWIDTH, EVENTGOHEIGHT, EVENTGOLENGTH);
var eventGoTimerL = 0;
var eventGoTimerR = 0;
var eventsL = [
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [0, 9],
  [0, 10],
  [0, 11],
  [0, 12]
];
var eventsR = [
  [0, 2.5],
  [0, 3],
  [0, 3.76],
  [1, 5.21]
];
// NOTATION SVGS ////////////////////////////////////////
var svgNS = "http://www.w3.org/2000/svg";
var testpitch = document.createElementNS(svgNS, 'image');
var testpitch2 = document.createElementNS(svgNS, 'image');
// SET UP -------------------------------------------------------------- //
function setup() {
  createScene();
  init();
  requestAnimationFrame(animationEngine);
}
// FUNCTION: init ------------------------------------------------------ //
function init() {
  // MAKE TEMPO FRETS ///////////////////////////////////
  //  mkEventSection(startTime, numbeats, tempo, trnum, fretClr, eventSet)
  eventSectionL = mkEventSection(3, 20, 72, 0, clr_purple, eventsL);
  eventSectionR = mkEventSection(4, 20, 63, 1, clr_neonMagenta, eventsR);
}
// FUNCTION: createScene ---------------------------------------------- //
function createScene() {
  // Camera ////////////////////////////////
  camera = new THREE.PerspectiveCamera(75, CANVASW / CANVASH, 1, 3000);
  camera.position.set(0, 500, 39);
  camera.position.set(0, 500, 50);
  camera.rotation.x = rads(-48);
  // Scene /////////////////////////////////
  scene = new THREE.Scene();
  // LIGHTS ////////////////////////////////
  var sun = new THREE.DirectionalLight(0xFFFFFF, 1.2);
  sun.position.set(100, 600, 175);
  scene.add(sun);
  var sun2 = new THREE.DirectionalLight(0x40A040, 0.6);
  sun2.position.set(-100, 350, 200);
  scene.add(sun2);
  // Renderer //////////////////////////////
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(CANVASW, CANVASH);
  canvas = document.getElementById('tlcanvas1');
  canvas.appendChild(renderer.domElement);
  // RUNWAY //////////////////////////////////
  var runwayMatl =
    new THREE.MeshLambertMaterial({
      color: 0x0040C0
    });
  var runwayGeom = new THREE.PlaneGeometry(
    CANVASW,
    RUNWAYLENGTH,
  );
  var runway = new THREE.Mesh(runwayGeom, runwayMatl);
  runway.position.z = -RUNWAYLENGTH / 2;
  runway.rotation.x = rads(-90);
  scene.add(runway);
  //TRACKS ///////////////////////////////////////////
  var trdiameter = 40;
  var trgeom = new THREE.CylinderGeometry(trdiameter, trdiameter, RUNWAYLENGTH, 32);
  var trmatl = new THREE.MeshLambertMaterial({
    color: 0x708090
  });
  var tr1 = new THREE.Mesh(trgeom, trmatl);
  tr1.rotation.x = rads(-90);
  tr1.position.z = -(RUNWAYLENGTH / 2);
  tr1.position.y = -trdiameter / 2;
  tr1.position.x = -TRDISTFROMCTR;
  scene.add(tr1);
  // var tr2 = new THREE.Mesh(trgeom, trmatl);
  // tr2.rotation.x = rads(-90);
  // tr2.position.z = -(RUNWAYLENGTH / 2);
  // tr2.position.y = -trdiameter / 2;
  // tr2.position.x = TRDISTFROMCTR;
  // scene.add(tr2);
  // GO FRET ////////////////////////////////////////////
  goFretL = new THREE.Mesh(goFretGeom, goFretLMatl);
  goFretL.position.z = GOFRETPOSZ;
  goFretL.position.y = GOFRETHEIGHT;
  goFretL.position.x = -TRDISTFROMCTR;
  scene.add(goFretL);
  // goFretR = new THREE.Mesh(goFretGeom, goFretRMatl);
  // goFretR.position.z = GOFRETPOSZ;
  // goFretR.position.y = GOFRETHEIGHT;
  // goFretR.position.x = TRDISTFROMCTR;
  // scene.add(goFretR);
  // EVENT GO ///////////////////////////////////////////////
  // eventGoL = new THREE.Mesh(eventGoGeom, eventGoLMatl);
  // eventGoL.position.z = EVENTGOPOSZ;
  // eventGoL.position.y = EVENTGOHEIGHT;
  // eventGoL.position.x = -TRDISTFROMCTR;
  // scene.add(eventGoL);
  // eventGoR = new THREE.Mesh(eventGoGeom, eventGoRMatl);
  // eventGoR.position.z = EVENTGOPOSZ;
  // eventGoR.position.y = EVENTGOHEIGHT;
  // eventGoR.position.x = TRDISTFROMCTR;
  // scene.add(eventGoR);
  // SVG NOTATION ///////////////////////////////////////////////
  testpitch.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/svgs/fs5.svg');
  testpitch.setAttributeNS(null, 'width', 320);
  testpitch.setAttributeNS(null, 'height', 385);
  testpitch.setAttributeNS(null, 'visibility', 'visible');
  document.getElementById("notationLSVG").appendChild(testpitch);
  testpitch2.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/svgs/aqf5.svg');
  testpitch2.setAttributeNS(null, 'width', 320);
  testpitch2.setAttributeNS(null, 'height', 385);
  testpitch2.setAttributeNS(null, 'visibility', 'visible');
  document.getElementById("notationRSVG").appendChild(testpitch2);
  // RENDER /////////////////////////////////////////////
  renderer.render(scene, camera);
}
// FUNCTION: animationEngine ------------------------------------- //
function animationEngine(timestamp) {
  delta += timestamp - lastFrameTimeMs;
  lastFrameTimeMs = timestamp;
  while (delta >= MSPERFRAME) {
    update(MSPERFRAME);
    draw();
    delta -= MSPERFRAME;
  }
  requestAnimationFrame(animationEngine);
}
// UPDATE -------------------------------------------------------------- //
function update(MSPERFRAME) {
  // CLOCK ///////////////////////////////////////////////
  framect++;
  pieceClock += MSPERFRAME;
  pieceClock = pieceClock - clockadj;
  // EVENTS /////////////////////////////////////////////////////
  // EVENT SECTION LEFT ///////////////////////////////////////
  //// TEMPO FRETS LEFT  ////////////////////////////////////
  for (var i = 0; i < eventSectionL[0].length; i++) {
    //add the tf to the scene if it is on the runway
    if (eventSectionL[0][i][1].position.z > (-RUNWAYLENGTH)) {
      if (eventSectionL[0][i][0]) {
        eventSectionL[0][i][0] = false;
        scene.add(eventSectionL[0][i][1]);
      }
    }
    //advance tf if it is not past gofret
    if (eventSectionL[0][i][1].position.z < GOFRETPOSZ) {
      eventSectionL[0][i][1].position.z += PXPERFRAME;
    }
    //When tf reaches goline, blink and remove
    if (framect == eventSectionL[0][i][2]) {
      goFretTimerL = framect + 15;
      //remove tf from scene and array
      scene.remove(scene.getObjectByName(eventSectionL[0][i][1].name));
      eventSectionL[0].splice(i, 1); //fix this
    }
  }
  //// EVENTS LEFT ////////////////////////////////////////
  // for (var i = 0; i < eventSectionL[1].length; i++) {
  //   //add the tf to the scene if it is on the runway
  //   if (eventSectionL[1][i][1].position.z > (-RUNWAYLENGTH)) {
  //     if (eventSectionL[1][i][0]) {
  //       eventSectionL[1][i][0] = false;
  //       scene.add(eventSectionL[1][i][1]);
  //     }
  //   }
  //   //advance tf if it is not past gofret
  //   if (eventSectionL[1][i][1].position.z < GOFRETPOSZ) {
  //     eventSectionL[1][i][1].position.z += PXPERFRAME;
  //   }
  //   //When tf reaches goline, blink and remove
  //   if (framect == eventSectionL[1][i][2]) {
  //     eventGoTimerL = framect + 15;
  //     //remove tf from scene and array
  //     scene.remove(scene.getObjectByName(eventSectionL[1][i][1].name));
  //     eventSectionL[1].splice(i, 1); //fix this
  //   }
  // }
  // EVENTS SECTION RIGHT /////////////////////////////////////
  //// TEMPO FRETS RIGHT  /////////////////////////////////////
  // for (var i = 0; i < eventSectionR[0].length; i++) {
  //   //add the tf to the scene if it is on the runway
  //   if (eventSectionR[0][i][1].position.z > (-RUNWAYLENGTH)) {
  //     if (eventSectionR[0][i][0]) {
  //       eventSectionR[0][i][0] = false;
  //       scene.add(eventSectionR[0][i][1]);
  //     }
  //   }
  //   //advance tf if it is not past gofret
  //   if (eventSectionR[0][i][1].position.z < GOFRETPOSZ) {
  //     eventSectionR[0][i][1].position.z += PXPERFRAME;
  //   }
  //   //When tf reaches goline, blink and remove
  //   if (framect == eventSectionR[0][i][2]) {
  //     goFretTimerR = framect + 15;
  //     //remove tf from scene and array
  //     scene.remove(scene.getObjectByName(eventSectionR[0][i][1].name));
  //     eventSectionR[0].splice(i, 1);
  //   }
  // }
  // //// EVENTS RIGHT  /////////////////////////////////////
  // for (var i = 0; i < eventSectionR[1].length; i++) {
  //   //add the tf to the scene if it is on the runway
  //   if (eventSectionR[1][i][1].position.z > (-RUNWAYLENGTH)) {
  //     if (eventSectionR[1][i][0]) {
  //       eventSectionR[1][i][0] = false;
  //       scene.add(eventSectionR[1][i][1]);
  //     }
  //   }
  //   //advance tf if it is not past gofret
  //   if (eventSectionR[1][i][1].position.z < GOFRETPOSZ) {
  //     eventSectionR[1][i][1].position.z += PXPERFRAME;
  //   }
  //   //When tf reaches goline, blink and remove
  //   if (framect == eventSectionR[1][i][2]) {
  //     eventGoTimerR = framect + 15;
  //     //remove tf from scene and array
  //     scene.remove(scene.getObjectByName(eventSectionR[1][i][1].name));
  //     eventSectionR[1].splice(i, 1);
  //   }
  // }
}
// DRAW ---------------------------------------------------------------- //
function draw() {
  // GO FRET BLINK TIMER ///////////////////////////////////
  if (framect >= goFretTimerL) {
    goFretL.material.color = clr_yellow;
    goFretL.geometry = goFretGeom;
  } else {
    goFretL.material.color = clr_safetyOrange;
    goFretL.geometry = goFretBigGeom;
  }
  // if (framect >= goFretTimerR) {
  //   goFretR.material.color = clr_yellow;
  //   goFretR.geometry = goFretGeom;
  // } else {
  //   goFretR.material.color = clr_safetyOrange;
  //   goFretR.geometry = goFretBigGeom;
  // }
  // EVENT BLINK TIMER ///////////////////////////////////
  // if (framect >= eventGoTimerL) {
  //   eventGoL.material.color = clr_neonGreen;
  //   eventGoL.geometry = eventGoGeom;
  // } else {
  //   eventGoL.material.color = clr_red;
  //   eventGoL.geometry = eventGoBigGeom;
  // }
  // if (framect >= eventGoTimerR) {
  //   eventGoR.material.color = clr_neonGreen;
  //   eventGoR.geometry = eventGoGeom;
  // } else {
  //   eventGoR.material.color = clr_red;
  //   eventGoR.geometry = eventGoBigGeom;
  // }
  // RENDER ///////////////////////////////////
  renderer.render(scene, camera);
}
// FUNCTION: rads ---------------------------------------------------- //
function rads(deg) {
  return (deg * Math.PI) / 180;
}
// FUNCTION: mkEventSection ------------------------------------------- //
function mkEventSection(startTime, numbeats, tempo, trnum, fretClr, eventSet) {
  var tempoFretSet = [];
  var numPxTilGo = startTime * PXPERSEC;
  var iGoPx = GOFRETPOSZ - numPxTilGo;
  var iGoFrame = numPxTilGo / PXPERFRAME;
  var pxPerBeat = PXPERSEC / (tempo / 60);
  // Make Tempo Frets ////////////////////////////////////
  for (var i = 0; i < numbeats; i++) {
    var tempStartPx = iGoPx - (pxPerBeat * i);
    var tempGoFrame = Math.round(iGoFrame + ((pxPerBeat / PXPERFRAME) * i));
    var tempMatl = new THREE.MeshLambertMaterial({
      color: fretClr
    });
    var tempTempoFret = new THREE.Mesh(tempoFretGeom, tempMatl);
    tempTempoFret.position.z = tempStartPx;
    tempTempoFret.position.y = TEMPOFRETHEIGHT;
    if (trnum == 0) {
      tempTempoFret.position.x = -TRDISTFROMCTR;
    } else {
      tempTempoFret.position.x = TRDISTFROMCTR;
    }
    tempTempoFret.name = "tempofret" + tempoFretIx;
    tempoFretIx++;
    var newTempoFret = [true, tempTempoFret, tempGoFrame];
    tempoFretSet.push(newTempoFret);
  }
  // Make Events /////////////////////////////////////////////
  var tempEventSet = [];
  for (var i = 0; i < eventSet.length; i++) {
    var tempEvent = new THREE.Mesh(eventGeom, eventMatl);
    var startpx, goframe;
    //Events can be scheduled by beat or seconds
    //Events Scheduled by beat
    if (eventSet[i][0] == 0) {
      startpx = iGoPx - (pxPerBeat * eventSet[i][1]);
      goframe = iGoFrame + Math.round((pxPerBeat / PXPERFRAME) * eventSet[i][1]);
    }
    //events Scheduled by seconds
    else if (eventSet[i][0] == 1) {
      startpx = iGoPx - (PXPERSEC * eventSet[i][1]);
      goframe = iGoFrame + Math.round(FRAMERATE * eventSet[i][1]);
    }
    tempEvent.position.z = startpx;
    tempEvent.position.y = EVENTGOHEIGHT;
    if (trnum == 0) {
      tempEvent.position.x = -TRDISTFROMCTR;
    } else {
      tempEvent.position.x = TRDISTFROMCTR;
    }
    tempEvent.name = "event" + i;
    var tempEventArray = [true, tempEvent, goframe];
    tempEventSet.push(tempEventArray);
  }
  return [tempoFretSet, tempEventSet];
}
