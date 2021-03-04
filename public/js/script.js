function playAudio(id){
  const audio = JSON.parse(document.querySelector(`#${id}`).dataset.audio);
  document.querySelector('.audio-modal h4').innerText = `${audio.audioTitle}`;
  document.querySelector('.audio-modal .poster img').src = `/img/music/${audio.audioPoster}.jpg`;
  document.querySelector('.audio-modal audio').src = `/audio/${audio.audioTitle}`;
  document.querySelector('.audio-modal').style.display = `flex`;
  document.querySelector('.audio-modal audio').play();
}

function closeModal(){
  document.querySelector('.audio-modal').style.display = `none`;
  document.querySelector('.audio-modal audio').pause();
  document.querySelector('.audio-modal audio').src = "";
}

let castRemoveBtn = document.querySelectorAll('#cast .remove-btn');
let timesRemoveBtn = document.querySelectorAll('#showing-times .remove-btn');
let cast = document.querySelector('#cast');
let showingTimes = document.querySelector('#showing-times');
let genres = document.querySelectorAll('.tags');

function addCast(){
  let castNode = document.querySelector('.clone').firstElementChild.cloneNode(true);
  cast.append(castNode)
  castRemoveBtn = document.querySelectorAll('#cast .remove-btn');
  Array.from(castRemoveBtn).forEach(btn => {
    btn.addEventListener('click', function(e){
      console.log(e.target.parentElement.parentElement.remove())
    })
  })
}

function addShowTime(){
  let timesNode = document.querySelector('.clone').lastElementChild.cloneNode(true);
  showingTimes.append(timesNode)
  timesRemoveBtn = document.querySelectorAll('#showing-times .remove-btn');
  Array.from(timesRemoveBtn).forEach(btn => {
    btn.addEventListener('click', function(e){
      console.log(e.target.parentElement.parentElement.remove())
    })
  })
}


Array.from(castRemoveBtn).forEach(btn => {
  btn.addEventListener('click', function(e){
    console.log(e.target.parentElement.parentElement.remove())
  })
})

Array.from(timesRemoveBtn).forEach(btn => {
  btn.addEventListener('click', function(e){
    console.log(e.target.parentElement.parentElement.remove())
  })
})

if(document.querySelector('#book-movie')){
  document.querySelector('#book-movie').onclick = function(){
    document.querySelector('.audio-modal').style.display = `flex`;
  }
}

let movie_genre = [];
Array.from(genres).forEach(genre => {
  genre.addEventListener('click', function(e){
    if(e.target.classList.contains('clicked')){
      e.target.classList.remove('clicked');
      movie_genre = movie_genre.filter(a => a != e.target.innerText);
      return document.querySelector('input[name="genre"]').value = movie_genre.join(',');
    }

    e.target.classList.add('clicked');
    movie_genre.push(e.target.innerText);
    return document.querySelector('input[name="genre"]').value = movie_genre.join(',');
  })
})