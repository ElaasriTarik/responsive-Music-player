const footer = document.querySelector('.footer')
const previewSong = document.querySelector('.previewSong')
const arrow_down_box = document.querySelector('.arrow_down_box')
const active_like_icon_box = document.querySelector('.active_like_icon_box')
const pausePlay_box = document.querySelector('.pausePlay')
const active_pause_icon = document.querySelector('.active_pause_icon')
const side_menu = document.querySelector('.side_menu')
const close_side_menu = document.querySelector('.close_side_menu')
const repeat_icon = document.querySelector('.repeat')
const shuffle_icon = document.querySelector('.shuffle')
const inputTag = document.querySelector('.inputTag')
const covers = ['images/p1.jpg', 'images/p2.jpg', 'images/p3.jpg', 'images/p4.jpg', 'images/p5.jpg', 'images/p6.jpg', 'images/p7.jpg', 'images/p8.jpg', 'images/p9.jpg', 'images/p10.jpg', 'images/p11.jpg', 'images/p12.jpg']

//default state
let footerState = false;
let menu_default_s = false;
let rep_state = false;
let shuff_state = false;
previewSong.addEventListener('click', () => {
   if (footerState === false) {
     footer.style.bottom = '0'
     arrow_down_box.style.display = "flex";
     active_like_icon_box.style.display = 'none';
     previewSong.style.padding = '0 10px'
     footerState = true;
     trigger_arrow_down()
   }
})
function trigger_arrow_down() {
  arrow_down_box.addEventListener('click', () => {
    if (footerState) {
      footer.style.bottom = 'var(--pr-height)'
      arrow_down_box.style.display = "none";
      active_like_icon_box.style.display = 'block';
      previewSong.style.padding = '0'
      footerState = false
    }
  })
}
let play_state = false;
[active_pause_icon, pausePlay_box].forEach((item, i) => {
   item.addEventListener('click', () => {
     if (play_state === false) {
       active_pause_icon.src = 'Icons/icon-pause.png'
       pausePlay_box.src = 'Icons/icon-pause-circle.png'
       play_state = true;
     } else {
       active_pause_icon.src = 'Icons/icon-play.png'
       pausePlay_box.src = 'Icons/icon-play-circle.png'
       play_state = false;
     }
   })
});
close_side_menu.addEventListener('click', () => {
  if (menu_default_s) {
   side_menu.style.left = '-100%'
   menu_default_s = false;
  }
})
repeat_icon.addEventListener('click', () => {
  if (!rep_state) {
     repeat_icon.src = 'Icons/icon-repeat-one.png';
     rep_state = true;
  } else{
     repeat_icon.src = 'Icons/icon-repeat.png';
     rep_state = false;
  }
})
shuffle_icon.addEventListener('click', () => {
  if (!shuff_state) {
     shuffle_icon.src = 'Icons/icon-shuffle-active.png';
     shuff_state = true;
  } else{
     shuffle_icon.src = 'Icons/icon-shuffle.png';
     shuff_state = false;
  }
})
inputTag.addEventListener('input', (e) =>{
  fetch('data.json')
    .then(response => response.json())
    .then(data =>{
      getAllFiles(e.target.files, data);
    }).catch(error => console.log('ERROR:',error))
})
//Creating audio Objects...
let list_audios = [];
function getAllFiles(files, data) {
  for (var i = 0; i < files.length; i++) {
    const objectURL = window.URL.createObjectURL(files[i]);
    const thisAudio = new Audio(objectURL)
    thisAudio.load()
    let thisFile = files[i]
    const loop_state = (files.length - 1) === i ? true:false;
    const curr_loop = i;
    thisAudio.onloadeddata = () => {
      const audio_duration = thisAudio.duration;
      creatingObject(thisFile, thisAudio, data, loop_state, curr_loop)
    }
  }
}
function creatingObject(file, thisAudio, data, loop_state, loop_current) {
  const randCover = covers[Math.floor(Math.random()*covers.length)]
  console.log(data);
  audioInfo = {
    name: file.name.includes('-') ? file.name.split('-')[1].trim():file.name,
    artist: file.name.includes('-') ? file.name.split('-')[0].trim():'Unknown',
    size: file.size,
    duration: thisAudio.duration,
    src: thisAudio.src,
    cover_image: randCover,
    id: `audio${loop_current}`
  }
  list_audios.push(audioInfo)

  console.log(list_audios);
  data = list_audios;
  console.log(data);
  loop_state ? displaying_audio_box(data):null;
}
const songs_list_box = document.querySelector('.songs_list_box')
function displaying_audio_box(data) {
  const audio_html_box = data.map((item) => {
    return `
    <div class="song_space ${item.id}">
       <div class="song_INLIST_cover">
         <img src=${item.cover_image} alt=${item.name + " cover photo"} class="song_INLIST_image">
       </div>
       <div class="song_INLIST_details">
         <h3 class="song_INLIST_title">${item.name}</h3>
         <h5 class="song_INLIST_artist">${item.artist}</h5>
       </div>
       <div class="song_INLIST_actions">
         <div class="song_INLIST_like">
           <img src="Icons/icon-filled-heart.png" alt="" class="icon song_INLIST_like_icon">
         </div>
         <div class="song_INLIST_options">
           <img src="Icons/icon-dot-bricks.png" alt="" class="icon song_INLIST_bricks_icon">
         </div>
       </div>
    </div>
      `
  }).join('')
  songs_list_box.innerHTML = audio_html_box;
  actions_on_spaces(data)
}
const active_artist_label = document.querySelector('.active_artist_label')
const active_title_label = document.querySelector('.active_title_label')
const active_song_cover = document.querySelector('.active_song_cover')
const active_banner = document.querySelector('.active_banner')
function actions_on_spaces(data) {
  const song_spaces = document.querySelectorAll('.song_space')
  song_spaces.forEach((item, i) => {
     item.addEventListener('click', () => {
       const active_box = data.filter((ele) => {
         return ele.id === item.classList[1]
       })
       active_artist_label.textContent = active_box[0].artist
       active_title_label.textContent = active_box[0].name
       active_song_cover.src = active_box[0].cover_image
       active_banner.src = active_box[0].cover_image
     })
  });

}
