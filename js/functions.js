$(document).ready(function() {

    // Random Track homepage

    function randomTrack() {
        var randomItem = Math.floor(Math.random()*localStorage.length);

        let track = JSON.parse(localStorage.getItem(localStorage.key(randomItem)));

        let renderTrack =  `<h3 class="col-12 text-center text-success fs-21 my-4">Dans vos favoris :</h3>
                            <div class="track-card random-track shadow-lg col-12 col-md-6 p-3 m-0 mb-4">
                                <div id="${track.id}" class="row p-0 m-2 track">
                                    <div class="col-2 col-sm-4 m-0 p-0">
                                        <img src="${track.cover}" class="w-100 rounded border-white">
                                    </div>
                                    <div class="col-10 col-sm-8 m-0 p-0 pl-4 text-white">
                                        <h3 class="title fs-16 m-0">${track.title}</h3>
                                        <p class="album font-italic text-secondary fs-14 m-0">${track.album}</p>
                                        <p class="fs-14">par <span class="artist text-success m-0">${track.artist}</span></p>
                                        <div class="d-flex align-items-center">
                                            <a href="" id="${track.preview}" class="button-play text-white fs-24 mr-4"><i class="fas fa-play"></i></a>
                                            <a href="" class="button-like text-secondary fs-16"><i class="fas fa-heart-broken"></i> Retirer de la liste</a>
                                        </div>                                            
                                    </div>
                                </div>                                
                            </div>
                            <a href="" id="randomTrack" class="col-12 text-center text-light-gray"><i class="fas fa-random"></i> Changer aléatoirement</a>`;
        
        $('#favorites').html(renderTrack);
    }

    // Lecture du fichier audio (envoi URL vers player)

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

    // Remove clé automatique généré par le player

    function clearLocalStoragePlayer() {
        localStorage.removeItem("cache-sprite-plyr");
    } 
    
    // Requête AJAX

    function searchOnDeezer(request, orderBy) {
        const API_URL = 'https://api.deezer.com/search';
        const params = { 
            q           : request, 
            order       : orderBy, 
            output      : 'jsonp' 
        };
        const query = $.ajax({
            url 		: API_URL,
            data 		: params,
            dataType 	: 'jsonp'
        });

        query.done(onSuccess);
        query.fail(onError);
    }

    // Récupération des résultats de recherche

    function onSuccess({ data : musics }) {
        const htmlContent = musics.map(renderMusic).join('');
        $('#results').html(htmlContent);

        // Gestion du stockage sur le localStorage

        $('.button-like').on('click', function(evt) {
            evt.preventDefault();

            if ($(this).hasClass("liked")) {
                let id = $(this).closest('.track').attr('id');
                let idTrackJSON = JSON.stringify(id);

                localStorage.removeItem(idTrackJSON);
                
                $(this).removeClass("liked");

            }
            else {

                $(this).addClass("liked");

                let cover   = $(this).closest('div').prev('div').children('img').attr('src');
                    title   = $(this).closest('div').children('.title').text(),
                    artist  = $(this).closest('div').children('p').children('.artist').text(),
                    album   = $(this).closest('div').children('.album').text(),
                    preview = $(this).prev().attr('id'),
                    id      = $(this).closest('.track').attr('id');

                let track = {
                    id: id,
                    cover: cover, 
                    title: title, 
                    artist: artist, 
                    album: album, 
                    preview: preview
                };
                let trackJSON = JSON.stringify(track);
                let idTrackJSON = JSON.stringify(id);

                localStorage.setItem(idTrackJSON, trackJSON);

            }                        
            
        });
    }

    // Rendu HTML d'un résultat

    function renderMusic(music) {

        // Vérification si track déjà mise en favori

        let liked = "";

        for (var i = 0; i < localStorage.length; i++) {
            let track = JSON.parse(localStorage.getItem(localStorage.key(i)));

            if (track.id == music.id) {
                liked = "liked";
            }
        }

        // Rendu HTML

        return `<div class="col-12 col-md-6 p-3 m-0 mb-5">
                    <div id="${music.id}" class="row p-0 m-2 track">
                        <div class="col-2 col-sm-4 m-0 p-0">
                            <img src="${music.album.cover_medium}" class="w-100 rounded border-white">
                        </div>
                        <div class="col-10 col-sm-8 m-0 p-0 pl-4 text-white">
                            <h3 class="title fs-16 m-0">${music.title_short}</h3>
                            <p class="album font-italic text-secondary fs-14 m-0">${music.album.title}</p>
                            <p class="fs-14">par <span class="artist text-primary m-0">${music.artist.name}</span></p>
                            <a href="" id="${music.preview}" class="button-play text-white fs-24 mr-4"><i class="fas fa-play"></i></a>
                            <a href="" class="button-like text-secondary fs-24 ${liked}"><i class="fas fa-heart"></i></a>
                        </div>
                    </div>                                
                </div>`;
    }

    // Message si erreur lors de la requête AJAX

    function onError(errorText) {
        $('#results').html(`<p class="text-center text-primary fs-24 w-100 mt-3">
                                ${errorText.statusText} ${errorText.status}
                            </p>
                            <p class="text-center fs-24 w-100 mt-3">
                                Oops ! Une erreur est survenue... 
                                <br><span class="text-light-gray fs-21">Relancez votre recherche dans quelques minutes :)</span>
                            </p>`);
    }

    // Message si aucun favoris enregistrés

    function messageNoFavorites() {
        return `<div class="row d-flex justify-content-center">
                    <p class="col-12 text-light-gray text-center m-3">Vous n'avez pas encore de musiques en favoris</p>
                    <a class="btn btn-success rounded-pill shadow px-4 py-3 m-3" href="search.html" role="button">Rechercher une musique</a>
                </div>`;
    }

    // Nombre de favoris sur le localStorage

    function countTracks() {
        if (localStorage.length === 1) {
            $('.nbTracks').html(nbTracks + ' titre');
        } else {
            $('.nbTracks').html(nbTracks + ' titres');
        }
    }

    

});