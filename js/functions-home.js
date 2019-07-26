$(document).ready(function() {

    localStorage.removeItem("cache-sprite-plyr");
    localStorage.removeItem("plyr");

    if (localStorage.length != 0) {
        randomTrack();
    }            

    $('#favorites').on('click', '#randomTrack', function(evt) {

        evt.preventDefault();

        randomTrack();

    });

    function randomTrack() {
        var randomItem = Math.floor(Math.random()*localStorage.length);

        let track = JSON.parse(localStorage.getItem(localStorage.key(randomItem)));

        let renderTrack =  `<h3 class="col-12 text-center text-success fs-21 my-4">Dans vos favoris :</h3>
                            <div class="track-card random-track shadow-lg col-12 col-md-6 p-3 m-0 mb-4">
                                <div id="${track.id}" class="row p-0 m-2 track">
                                    <div class="col-2 col-sm-4 m-0 p-0 d-none d-sm-block">
                                        <img src="${track.cover}" class="w-100 rounded border-white">
                                    </div>
                                    <div class="col-10 col-sm-8 m-0 p-0 pl-4 text-white">
                                        <h3 class="title fs-16 m-0">${track.title}</h3>
                                        <p class="album font-italic text-secondary fs-14 m-0">${track.album}</p>
                                        <p class="fs-14">par <span class="artist text-success m-0">${track.artist}</span></p>
                                        <div class="d-flex align-items-center">
                                            <a href="" id="${track.preview}" class="button-play d-flex align-items-center text-white fs-18 mr-4"><i class="fas fa-play mr-2"></i>Ecouter</a>
                                        </div>                                            
                                    </div>
                                </div>                                
                            </div>
                            <a href="" id="randomTrack" class="col-12 text-center text-light-gray"><i class="fas fa-random"></i> Changer aléatoirement</a>`;
        
        $('#favorites').html(renderTrack);
    }

    $('#favorites').on('click', '.button-play', function(evt) {

        evt.preventDefault();

        if($('i', this).attr('class') === 'fas fa-play mr-2') {

            const linkPreview = $(this).attr('id');
            $('i', this).removeClass();
            $('i', this).addClass('fas fa-pause mr-2');

            if($('#player-footer').attr('src') === linkPreview) {
                player.play();
            }
            else {
                $('#player-footer').attr('src', linkPreview);
                player.play();
            }
        }
        else {
            $('i', this).removeClass();
            $('i', this).addClass('fas fa-play mr-2');
            player.pause();                          
        }

    });

});