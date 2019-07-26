$(document).ready(function() {

    localStorage.removeItem("cache-sprite-plyr");
    localStorage.removeItem("plyr");
    
    $('form#search').on('submit', function(evt) {

        evt.preventDefault();

        if ($('#search input').val().length !=0) {
            $('#messageForm').html('');
            const request = encodeURIComponent($('#request').val());
            const orderBy = encodeURIComponent($('#orderBy').val());
            searchOnDeezer(request, orderBy);

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
                query.done(pagination);
                query.fail(onError);
            }
            function onSuccess({ data : musics }) {
                console.log(musics.length);
                if (musics.length == 0) {
                    $('#results').html('<p class="text-center w-100">Aucun résultat</p>');
                } else {
                    const htmlContent = musics.map(renderMusic).join('');
                    $('#results').html(htmlContent);
                    
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
                
            }

            function pagination(data) {
                if (data.length != 0 && data.next) {
                    $('#pagination').html(`<a href="${data.next}" class="btn btn-outline-success btn-page m-2">Suivant</a>`);                        
                    if (data.prev) {
                        $('#pagination').html(`<a href="${data.prev}" class="btn btn-outline-secondary btn-page m-2">Précédent</a>`);
                        $('#pagination').append(`<a href="${data.next}" class="btn btn-outline-success btn-page m-2">Suivant</a>`);
                    }
                } else {
                    $('#pagination').html(``);
                }

                $('.btn-page').on('click', function(evt) {

                    evt.preventDefault();

                    const query = $.ajax({
                        url 		: $(this).attr('href'),
                        dataType 	: 'jsonp'
                    });

                    query.done(onSuccess);
                    query.done(pagination);
                    query.fail(onError);
                });
                
            }

            function onError(errorText) {
                $('#results').html(`<p class="text-center text-primary fs-24 w-100 mt-3">
                                        ${errorText.statusText} ${errorText.status}
                                    </p>
                                    <p class="text-center fs-24 w-100 mt-3">
                                        Oops ! Une erreur est survenue... 
                                        <br><span class="text-light-gray fs-21">Relancez votre recherche dans quelques minutes :)</span>
                                    </p>`);
            }

            function renderMusic(music) {

                let liked = "";

                for (var i = 0; i < localStorage.length; i++) {
                    let track = JSON.parse(localStorage.getItem(localStorage.key(i)));

                    if (track.id == music.id) {
                        liked = "liked";
                    }
                }

                return `<div class="col-12 col-md-6 p-0 m-0">
                            <div id="${music.id}" class="row p-3 mx-2 my-2 track-card track">
                                <div class="col-sm-4 m-0 p-0 d-none d-sm-block">
                                    <img src="${music.album.cover_medium}" class="w-100 rounded border-white">
                                </div>
                                <div class="col-12 col-sm-8 m-0 p-0 pl-2 pl-sm-4 text-white">
                                    <h3 class="title fs-16 m-0">${music.title_short}</h3>
                                    <p class="album font-italic text-secondary fs-14 m-0">${music.album.title}</p>
                                    <p class="fs-14">par <span class="artist text-primary m-0">${music.artist.name}</span></p>
                                    <a href="" id="${music.preview}" class="button-play text-white fs-24 mr-4"><i class="fas fa-play"></i></a>
                                    <a href="" class="button-like text-secondary fs-24 ${liked}"><i class="fas fa-heart"></i></a>
                                </div>
                            </div>                                
                        </div>`;
            }  
        }
        else {
            messageForm = ` <p class="text-danger text-center mt-4" role="alert">Veuillez remplir les champs du formulaire avant de valider !</p>`;
            $('#messageForm').html(messageForm);
        }                        

    });
    
});