$(document).ready(function() {

    localStorage.removeItem("cache-sprite-plyr");
    localStorage.removeItem("plyr");

    function messageNoFavorites() {
        return `<div class="row d-flex justify-content-center">
                    <p class="col-12 text-light-gray text-center m-3">Vous n'avez pas encore de musiques en favoris</p>
                    <a class="btn btn-success rounded-pill shadow px-4 py-3 m-3" href="search.html" role="button">Rechercher une musique</a>
                </div>`;
    }  

    if (localStorage.length === 0) {

        messageNoFavorites();
        $('#messageNotFavorites').html(messageNoFavorites);

    }
    else {

        let headerFavorites =   `<div class="row d-flex justify-content-between px-0 py-2 mx-2 mx-sm-0 mt-5 border border-secondary border-top-0 border-left-0 border-right-0">
                                    <p class="col-6 p-0 text-light-gray"><span class="nbTracks text-white font-weight-bold"></span> dans votre liste</p>
                                    <a href="" class="clear-favorites col-6 p-0 text-success text-right">Tout effacer</a>
                                </div>`;
        $('#headerFavorites').append(headerFavorites);

        $('.clear-favorites').on('click', function(evt) {
            evt.preventDefault();
            localStorage.clear();
            $('#favorites').children('div').fadeOut( "slow", function() {
                $(this).remove();
            });
            $('#headerFavorites').children('div').fadeOut( "slow", function() {
                $(this).remove();
                messageNoFavorites();
                $('#messageNotFavorites').html(messageNoFavorites);
            });
        });

        let nbTracks = localStorage.length;
        countTracks();

        function countTracks() {
            if (localStorage.length === 1) {
                $('.nbTracks').html(nbTracks + ' titre');
            } else {
                $('.nbTracks').html(nbTracks + ' titres');
            }
        }

        for (var i = 0; i < localStorage.length; i++) {
            let track = JSON.parse(localStorage.getItem(localStorage.key(i)));

            let renderTrack =  `<div class="col-12 col-md-6 p-0 m-0 fade-track">
                                    <div id="${track.id}" class="row p-3 mx-2 my-2 track-card track">
                                        <div class="col-sm-4 m-0 p-0 d-none d-sm-block">
                                            <img src="${track.cover}" class="w-100 rounded border-white">
                                        </div>
                                        <div class="col-12 col-sm-8 m-0 p-0 pl-4 text-white">
                                            <h3 class="title fs-16 m-0">${track.title}</h3>
                                            <p class="album font-italic text-secondary fs-14 m-0">${track.album}</p>
                                            <p class="fs-14">par <span class="artist text-success m-0">${track.artist}</span></p>
                                            <div class="d-flex align-items-center">
                                                <a href="" id="${track.preview}" class="button-play text-white fs-24 mr-4"><i class="fas fa-play"></i></a>
                                                <a href="" class="button-like text-secondary fs-16"><i class="fas fa-heart-broken"></i> Retirer de la liste</a>
                                            </div>                                            
                                        </div>
                                    </div>                                
                                </div>`;
            
            $('#favorites').append(renderTrack);
        }
        $('.button-like').on('click', function(evt) {
            evt.preventDefault();

            let id = $(this).closest('.track').attr('id');
            let idTrackJSON = JSON.stringify(id);

            localStorage.removeItem(idTrackJSON);

            $(this).parents('.fade-track').fadeOut( "slow", function() {
                $(this).parents('.fade-track').remove();
            });

            nbTracks = localStorage.length;                

            if (localStorage.length === 0) {
                $('#headerFavorites').children('div').fadeOut( "slow", function() {
                    $(this).remove();
                    messageNoFavorites();
                    $('#messageNotFavorites').html(messageNoFavorites);
                });                    
            }
            else {
                countTracks();
            }

        });
        $('.button-play').on('click', function(evt) {

            evt.preventDefault();

            if($('i', this).attr('class') === 'fas fa-play') {
                $('.button-play i').removeClass();
                $('.button-play i').addClass('fas fa-play');

                const linkPreview = $(this).attr('id');
                $('i', this).removeClass();
                $('i', this).addClass('fas fa-pause');

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
                $('i', this).addClass('fas fa-play');
                player.pause();                          
            }

        });

    }
});