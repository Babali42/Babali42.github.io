var analyser = Pizzicato.context.createAnalyser();
analyser.fftSize = 2048;
var dataArray = new Uint8Array(analyser.fftSize);

var isMusicPlaying = false;
var numberLoaded = 0;
var numberTotalToLoad = 13;

var pist_0_Transition = new Pizzicato.Sound({source: 'file',
options: { path: './sounds/0_transitions.mp3', loop: true }}, function() {
  loadIncrease();
});
var pist_1_kick = new Pizzicato.Sound({source: 'file',
  options: { path: './sounds/1_kick.mp3', loop: true }}, function() {
  loadIncrease();
});
var pist_1_1_kick_fx = new Pizzicato.Sound({source: 'file',
options: { path: './sounds/1_1_kick_fx.mp3', loop: true }}, function() {
  loadIncrease();
});
var pist_2_snare = new Pizzicato.Sound({source: 'file',
options: { path: './sounds/2_snare.mp3', loop: true }}, function() {
  loadIncrease();
});
var pist_2_snare_fx = new Pizzicato.Sound({source: 'file',
options: { path: './sounds/2_1_snare_fx.mp3', loop: true }}, function() {
  loadIncrease();
});
var pist_3_hat = new Pizzicato.Sound({source: 'file',
options: { path: './sounds/3_hat.mp3', loop: true }}, function() {
  loadIncrease();
});
var pist_3_1_hat_fx = new Pizzicato.Sound({source: 'file',
options: { path: './sounds/3_1_hat_fx.mp3', loop: true }}, function() {
  loadIncrease();
});
var pist_4_toms = new Pizzicato.Sound({source: 'file',
options: { path: './sounds/4_toms.mp3', loop: true }}, function() {
  loadIncrease();
});
var pist_5_bass = new Pizzicato.Sound({source: 'file',
options: { path: './sounds/5_bass.mp3', loop: true }}, function() {
  loadIncrease();
});
var pist_6_sub_bass = new Pizzicato.Sound({source: 'file',
options: { path: './sounds/6_sub_bass.mp3', loop: true }}, function() {
  loadIncrease();
});
var pist_7_skank = new Pizzicato.Sound({source: 'file',
options: { path: './sounds/7_skank.mp3', loop: true }}, function() {
  loadIncrease();
});
var pist_7_1_skank_fx = new Pizzicato.Sound({source: 'file',
options: { path: './sounds/7_1_skank_fx.mp3', loop: true }}, function() {
  loadIncrease();
});
var pist_8_melodies = new Pizzicato.Sound({source: 'file',
options: { path: './sounds/8_melodies.mp3', loop: true }}, function() {
  loadIncrease();
});

var pist_4_toms_flanger = new Pizzicato.Effects.Flanger({
  time: 0.45,
  speed: 0.2,
  depth: 1,
  feedback: 0.1,
  mix: 0
});
var pist_5_bass_lowPassFilter = new Pizzicato.Effects.LowPassFilter({
    frequency: 20000,
    peak: 1
});

var pist_6_sub_bass_lowPassFilter = new Pizzicato.Effects.LowPassFilter({
    frequency: 20000,
    peak: 1
});

var pist_8_melodies_flanger = new Pizzicato.Effects.Flanger({
    time: 0.45,
    speed: 0.2,
    depth: 1,
    feedback: 0.1,
    mix: 0
});

function loadIncrease(){
  numberLoaded++;

  document.getElementById('number-sounds-loaded').innerHTML = Math.trunc(numberLoaded * 100 / numberTotalToLoad);
  if(numberLoaded >= numberTotalToLoad){
    var button = document.getElementById('close-modal');
    button.disabled = false;
    button.classList.remove("button-disabled");
    var button = document.getElementById('tuto-modal');
    button.disabled = false;
    button.classList.remove("button-disabled");
    soundSetting();
  }
}

function play(){
  pist_0_Transition.play();
  pist_1_kick.play();
  pist_1_1_kick_fx.play();
  pist_2_snare.play();
  pist_2_snare_fx.play();
  pist_3_hat.play();
  pist_3_1_hat_fx.play();
  pist_4_toms.play();
  pist_5_bass.play();
  pist_6_sub_bass.play();
  pist_7_skank.play();
  pist_7_1_skank_fx.play();
  pist_8_melodies.play();
  $('#play').addClass('invisible');
  $('#pause').removeClass('invisible');
  isMusicPlaying = true;
}

function soundSetting(){
  pist_0_Transition.volume = 1;
  pist_1_kick.volume = 1;
  pist_1_1_kick_fx.volume = 0;
  pist_2_snare.volume = 1;
  pist_2_snare_fx.volume = 0;
  pist_3_hat.volume = 1;
  pist_3_1_hat_fx.volume = 0;
  pist_4_toms.volume = 1;
  pist_5_bass.volume = 1;
  pist_6_sub_bass.volume = 1;
  pist_7_skank.volume = 1;
  pist_7_1_skank_fx.volume = 0;
  pist_8_melodies.volume = 1;

  pist_8_melodies.addEffect(pist_8_melodies_flanger);
  pist_5_bass.addEffect(pist_5_bass_lowPassFilter);
  pist_6_sub_bass.addEffect(pist_6_sub_bass_lowPassFilter);
  pist_4_toms.addEffect(pist_4_toms_flanger);

  pist_0_Transition.connect(analyser);
  pist_1_kick.connect(analyser);
  pist_1_1_kick_fx.connect(analyser);
  pist_2_snare.connect(analyser);
  pist_2_snare_fx.connect(analyser);
  pist_3_hat.connect(analyser);
  pist_3_1_hat_fx.connect(analyser);
  pist_4_toms.connect(analyser);
  pist_5_bass.connect(analyser);
  pist_6_sub_bass.connect(analyser);
  pist_7_skank.connect(analyser);
  pist_7_1_skank_fx.connect(analyser);
  pist_8_melodies.connect(analyser);

  analyser.connect(Pizzicato.context.destination);
}

function pause(){
  pist_0_Transition.pause();
  pist_1_kick.pause();
  pist_1_1_kick_fx.pause();
  pist_2_snare.pause();
  pist_2_snare_fx.pause();
  pist_3_hat.pause();
  pist_3_1_hat_fx.pause();
  pist_4_toms.pause();
  pist_5_bass.pause();
  pist_6_sub_bass.pause();
  pist_7_skank.pause();
  pist_7_1_skank_fx.pause();
  pist_8_melodies.pause();
  $('#play').removeClass('invisible');
  $('#pause').addClass('invisible');
  isMusicPlaying = false;
}

function adjustVolume(faderName, value){
    switch(faderName) {
        case 1:
            pist_1_kick.volume = value;
          break;
        case 2:
            pist_2_snare.volume = value;
          break;
        case 3:
            pist_3_hat.volume = value;
          break;
        case 4:
            pist_4_toms.volume = value;
          break;
        case 5:
            pist_5_bass.volume = value;
          break;
        case 6:
            pist_6_sub_bass.volume = value;
          break;
        case 7:
            pist_7_skank.volume = value;
          break;
        case 8:
            pist_8_melodies.volume = value;
          break;
    }
}

function adjustEffect(potardName, value){
    switch(potardName) {
        case 1:
            pist_1_1_kick_fx.volume = value;
          break;
        case 2:
            pist_2_snare_fx.volume = value;
          break;
        case 3:
            pist_3_1_hat_fx.volume = value;
          break;
        case 4:
            pist_4_toms_flanger.mix = value;
          break;
        case 5:
            pist_5_bass_lowPassFilter.frequency = value * 1000 + 100;
          break;
        case 6:
            pist_6_sub_bass_lowPassFilter.frequency = value * 600 + 100;
          break;
        case 7:
            pist_7_1_skank_fx.volume = value;
          break;
        case 8:
            pist_8_melodies_flanger.mix = value;
          break;
    }
}