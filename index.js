////////////////////////////////Intialization of variables/////////////////////////////////////////////
//importing songs file
import songsList from "./songs.js";

//using jquery to select HTML elements for dynamic changing
const musicPlayer = $("#music_player");
const songsListDiv = $("#songs_list"); 
const openButton = $("#songs_list_open");
const closeButton = $("#songs_list_close");
const songImg = $("#song_img");
const songName = $("#song_name");
const songSinger = $("#singer_name");
const shuffleButton = $("#shuffle");
const backButton = $("#backward_step");
const playButton = $("#play");
const pauseButton = $("#pause");
const nextButton = $("#forward_step");
const repeatButton = $("#repeat");
const progressBar = $("#progress_bar");
const currentProgress = $("#current_progress");
const currentTime = $("#current_time");
const maxDuration = $("#max_duration");



//initial values for variables
let loop = true;
let shuffle = false;
var arr = [0,1,2,3,4];
let songNo = 0;
let song = new Audio(songsList[songNo].link);








///////////////////////////////////////////////functions///////////////////////////////////////////////

//format time
const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60);
    minute = minute < 10 ? "0" + minute : minute;
    let second = Math.floor(timeInput % 60);
    second = second < 10 ? "0" + second : second;
    return `${minute}:${second}`;
};

//change song duration acc to songs after matadata is loaded
song.onloadedmetadata = () => {
    maxDuration.text(timeFormatter(song.duration));
};

//used to set in different functions
function setSong(songIndex) {
    if(songIndex > 4){
        if(loop){
            songNo = 0;
        }else{
            pauseSong();
            return false;
        }
    }
    else if(songIndex < 0){
        songNo = 4;
    }
    else{
        songNo = songIndex;
    }
    let SongNo = arr[songNo];
    song = new Audio(songsList[SongNo].link);
    songImg.attr("src", songsList[SongNo].image);
    songName.text(songsList[SongNo].name);
    songSinger.text(songsList[SongNo].artists);
    song.onloadedmetadata = () => {
        maxDuration.text(timeFormatter(song.duration));
    };
    return true;
}

//to play song
function playSong(){
    song.play();
    playButton.addClass("hide");
    pauseButton.removeClass("hide");
}

//to pause song
function pauseSong(){
    song.pause();
    pauseButton.addClass("hide");
    playButton.removeClass("hide");
}

//to create dynamic playlist of songs after open button for playlist is clicked
function dynamicPlaylist(){
    let i = 1;
    songsList.forEach(song => {
        $("#dynamic_playlist").append('<div class="song_details" id="song'+ i +'"><img class="list_img" src="' + song.image + '"  alt="song img"><div><p class="songs_name">' + song.name + '</p><p class="songs_singer">' + song.artists + '</p></div></div>');
        i++;
    });
}








//////////////////////////////////////////////////Event Handeling///////////////////////////////////////
openButton.click(function(){
    musicPlayer.addClass("hide");
    songsListDiv.removeClass("hide");
    dynamicPlaylist();
});

closeButton.click(function(){
    $("#dynamic_playlist").html("");
    songsListDiv.addClass("hide");
    musicPlayer.removeClass("hide");
});
playButton.click(function(){
    playSong();
});

pauseButton.click(function(){
    pauseSong();
});

nextButton.click(function(){
    pauseSong();
    setSong(songNo + 1);
    playSong();
});

backButton.click(function(){
    pauseSong();
    setSong(songNo - 1);
    playSong();
});

repeatButton.click(function(){
    if(loop){
        loop = false;
        repeatButton.removeClass("click");
        repeatButton.addClass("not_click");
    }else{
        loop = true;
        repeatButton.removeClass("not_click");
        repeatButton.addClass("click");
    }
});

shuffleButton.click(function(){
    pauseSong();
    //intializing default arr if shuffle button is not clicked and other variables to 0
    if(shuffle){
        songNo = 0;
        arr = [0,1,2,3,4];
        shuffle = false;
        shuffleButton.removeClass("click");
        shuffleButton.addClass("not_click");
        setSong(0);
    }else{
        //intializing randomized arr if shuffle button is not clicked and other variables to 0
        songNo = 0;
        arr = [];
        while(arr.length < 5){
            var r = Math.floor(Math.random() * 5);
            if(arr.indexOf(r) === -1) {
                arr.push(r);
            }
        }
        shuffle = true;
        shuffleButton.removeClass("not_click");
        shuffleButton.addClass("click");
        setSong(0);
    }
    playSong();
    console.log(arr, shuffle);
});










///////////////////////// Very Important///////////////////////////////////////////////////////////
//update after click on progress bar
progressBar.click(function(event){
    let coordStart = this.getBoundingClientRect().left;
        //mouse click position
    let coordEnd =  event.clientX;
    let progress = (coordEnd - coordStart) / this.offsetWidth;
    currentProgress.css("width", progress * 100 + "%");
    song.currentTime = progress * song.duration;
});

//update progress and current time every second
setInterval(() => {
    currentTime.text(timeFormatter(song.currentTime));
    currentProgress.css("width", song.currentTime / song.duration.toFixed(3) * 100 + "%");
    if(song.currentTime === song.duration){
        pauseSong();
        //checking if loop is on or off by the return value of setSong func
        if(setSong(songNo + 1)){
            playSong();
        }
    }
}, 1000);
