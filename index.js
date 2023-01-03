import songsList from "./songs.js";
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

let loop = true;
let songNo = 0;
let song = new Audio(songsList[songNo].link);

const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60);
    minute = minute < 10 ? "0" + minute : minute;
    let second = Math.floor(timeInput % 60);
    second = second < 10 ? "0" + second : second;
    return `${minute}:${second}`;
};
song.onloadedmetadata = () => {
    maxDuration.text(timeFormatter(song.duration));
};
function setSong(songIndex) {
    if(songIndex > 4){
        songNo = 0;
    }
    else if(songIndex < 0){
        songNo = 4;
    }
    else{
        songNo = songIndex;
    }
    song = new Audio(songsList[songNo].link);
    songImg.attr("src", songsList[songNo].image);
    songName.text(songsList[songNo].name);
    songSinger.text(songsList[songNo].artists);
    song.onloadedmetadata = () => {
        maxDuration.text(timeFormatter(song.duration));
    };
}

function playSong(){
    song.play();
    playButton.addClass("hide");
    pauseButton.removeClass("hide");
}

function pauseSong(){
    song.pause();
    pauseButton.addClass("hide");
    playButton.removeClass("hide");
}

function dynamicPlaylist(){
    let i = 1;
    songsList.forEach(song => {
        $("#dynamic_playlist").append('<div class="song_details" id="song'+ i +'"><img class="list_img" src="' + song.image + '"  alt="song img"><div><p class="songs_name">' + song.name + '</p><p class="songs_singer">' + song.artists + '</p></div></div>');
        i++;
    });
}











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

//update progress every second
setInterval(() => {
    currentTime.text(timeFormatter(song.currentTime));
    currentProgress.css("width", song.currentTime / song.duration.toFixed(3) * 100 + "%");
    if(song.currentTime === song.duration){
        pauseSong();
        setSong(songNo + 1);
        playSong();
    }
}, 1000);
