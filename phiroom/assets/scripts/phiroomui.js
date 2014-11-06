/**
* Phiroom
*
* Copyright 2013 Lavilotte-Rolle Frédéric
*
* @contact <phiroom@lavilotte-rolle.fr>
*
*    This file is part of Phiroom.
*
*   Phiroom is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   Phiroom is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with Phiroom in COPYING file.
*   If not, see <http://www.gnu.org/licenses/>.
*
*/


// Fonction de justification des aperçus
function justify_thumb() {
    // Compute inner width (without scrollbar if any)
    var div = $('<div></div>'); // creating test div
    $('#content').append(div); // append test div in section
    var innerWidth = div.width(); // Compute width of test div
    div.remove(); // remove test div

    // Definition of the min number of picture per line
    var min_picture = Math.ceil((innerWidth - 3) / 327);
    // Definition of the width of thumb-container
    var width_thumb_container = Math.floor((innerWidth -
                (min_picture * 3 + 3)) / min_picture);
    $('article.thumb div.thumb-container').css('width', width_thumb_container)
        .css('height', width_thumb_container)
        .css('line-height', width_thumb_container + 'px');

    // Definition of the picture size
    var size_picture = width_thumb_container - 24;
    $('img.thumbnail').css('max-width', size_picture)
        .css('max-height', size_picture);
}

// Fonction de fermeture de la fenêtre overlay
function close_overlay() {
    // On supprime la fenêtre puis l'overlay
    $('#popup').fadeOut();
    $('#overlay').fadeOut('normal', function() {
        $('#popup').remove();
        justify_thumb();
    });
    // Si les popups des boutons + sont ouvert on les ferme
    if ($('ul.popover').is(':visible')) {
        $('ul.popover').hide();
    }
    // On revient un cran en arrière dans l'historique
    window.history.back();
}

// Fonction de fadin fadout des popover
function toggle_popover() {
    // Si le menu est ouvert on le ferme
    if ($(this).next('ul.popover').is(':visible')) {
        $(this).next('ul.popover').fadeOut();
    }
    // Sinon on ferme les autres et on l'ouvre l'ouvre
    else {
        $('ul.popover').fadeOut();
        $(this).next('ul.popover').fadeIn();
    }
    // On empêche le navigateur de suivre le lien :
    return false;
}

// Fonction de masquage des éléments
function hide_elements() {
    // On change les css (pour éviter le conflit avec les hide css)
    // et on les cache
    $('#nav ul.submenu').css({display: 'block'}).hide();
    $('#nav ul.popover, #content article.thumb ul.popover')
        .css({display: 'block'}).hide();
    $('#overlay').css({display: 'block'}).hide();
    $('#lightbox').hide();
    $('.js-hide').hide();
}

// Fonction to get cookie from django doc
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


$(document).ready(function ready() { // lorsque le dom est prêt
	hide_elements(); // On cache les éléments

    // pour le csrf_token from django doc
    var csrftoken = getCookie('csrftoken');
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            }
        }
    });

    // to conform ajax request to http standart (and avoid hacks for php)
    $.ajaxSettings.traditional = true;

    // Fonction de scroll  jusqu'à un élément
    function scroll_to(parent, element) {
        $(parent).animate({scrollTop: $(element).offset().top},1000);
    }

    // Scroll smoth jusqu'au haut de page
    $('#frame section').on('click', '#pageup', function() {
        scroll_to('#frame section', '#top');
        return false;
    });

    // Déroulement des menus latéraux
    $('#left_panel').on('click', 'li.togglesubmenu > a:not(a.plus)', function() {
        // Si le sous-menu était déjà ouvert, on le referme :
        if ($(this).parent().find('ul.submenu:visible').length != 0) {
			// On lui enlève la class selected
			$(this).removeClass('selected');
			$(this).hover(
				// au survol on ajoute la classe hover
				function() { $(this).addClass('hover');},
				function() { $(this).removeClass('hover');}
			);
			$(this).parent().find('ul.submenu').slideUp('normal');

        }
        // Si le sous-menu est caché,
        // on l'affiche  en lui donnant la classe "selected":
        else {
			// On ajoute la classe selected au menu cliqué
			$(this).addClass('selected');
			// On ouvre le menu cliqué
			$(this).parent().find('ul.submenu').slideDown('normal');
        }
        // On empêche le navigateur de suivre le lien :
        return false;
		// Au click sur les lien a.plus on affiche ou cache la ul.popover
    }).on('click', 'a.plus', toggle_popover);

	// Au clic sur les menus des vignettes on affiche ou cache la popover
	$('#content').on('click', 'article.thumb a.thumb-menu', toggle_popover);

    // Au clic sur les a.del on charge le lien en ajax, on recharge le menu latéral
    // et on supprime la vignette
    $('#content').on('click', 'article.thumb a.del', function() {
        var link = $(this).attr('href');
        var target = $(this).attr('data-url');
        var thumb = $(this).parents('article.thumb');
        $('#left_panel #nav a.dia[href="' + target + '"] span.count')
            .load(link, function(e) {
            $(thumb).remove();
        });

        // On empêche le navigateur de suivre le lien
        return false;
    });

	// au clic sur body on ferme les popover
	$('body').click(function() {
		$('ul.popover').fadeOut();
	});

   /* // au clic sur les liens .load on charge le contenu dans l'id indiqué
    $("#left_panel").on('click', 'a.load', function() {
        var link = $(this).attr('href');
        var target = $(this).attr('data-target');
        // On charge le contenu du lien dans la cible
        $.get(link, function(response) {
            // on remplace le contenu de la cible par la réponse
            $('#'+target).html(response);
            // on change l'url;
            window.history.pushState(link, "", link);
            // On rend les éléments draggable
            // on justifi les vignettes
            justify_thumb();
            // On relance la fonction de rating des images
            rate_thumb();
        });
        return false;
    });*/

// Fenêtre de formulaires
	$('#frame').on('click', 'a.popup', function(e) {
		// On affiche l'overlay
		$('#overlay').fadeIn();
		// On ajoute la fenêtre
		$('body').prepend('<section id="popup"></section>');
		$('#popup').hide().fadeIn();
		// On défini le lien par défaut
		var link = $(this).attr('href');
        function load_in_popup() {
            // On charge le contenu du lien dans "section#popup" avec .load
            $('#popup').load(link, function ajax_submit() {
                // On change l'url
                window.history.pushState(link, '', link);
                // On justifi les vignettes
                justify_thumb();
                // On surveille quel submit est cliqué en cas de multiple submit
                $('#popup form input[type=submit]').click(function() {
                    // On attribut le nom du submit clické à une variable
                    clickedsubmit = $(this).attr('name');
                });

                // On surveille le submit des formulaires pour les envoyer en ajax
                $('#popup form').on('submit', function() {
                    $.ajax({
                        url: link,
                        type: $(this).attr('method'),
                        enctype: 'multipart/form-data',
                        // on ajoute le submit cliqué
                        data: $(this).serialize() + '&' + clickedsubmit + '=""',
                        success: function(data) {
                            if (data['redirect']) {
                                // Si on a une demande de redirection on redirige
                                window.location.href = data['redirect'];
                            }
                            else if (data['form']) {
                                // On rerempli le form avec les données reçues
                                $('#popup').html(data['form']);
                                // Si on doit se déplacer vers une ancre
                                if (data['moveto']) {
                                    // On se déplace jusqu'à l'ancre
                                    $(document).scrollTop($(data['moveto']).offset().top);
                                }
                                // On relance la fonction de submit en ajax
                                ajax_submit();
                            }
                            else {
                                if (data['reload']) {
                                    // On remplace le contenu des éléments désignés
                                    // par la clé par le contenu lié
                                    for (var key in data['reload']) {
                                        $(key).empty().append(data['reload'][key]);
                                    }
                                }
                                if (data['append']) {
                                    // On ajoute le contenu lié aux éléments
                                    // désignés par la clé
                                    for (var key in data['append']) {
                                        $(key).append(data['append'][key]);
                                    }
                                }
                                if (data['delete']) {
                                    // On supprime les éléments ciblés
                                    for (var key in data['delete']) {
                                        $(key).remove();
                                    }
                                }
                                if (data['loadurl']) {
                                    // Charge l'url dans l'élément ciblé
                                    for (var key in data['loadurl']) {
                                        $(key).load(data['loadurl'][key], ajax_submit);
                                        link = data['loadurl'][key];
                                    }
                                }
                                if (! data['close']) {
                                    // On cache les éléments
                                    hide_elements();
                                    close_overlay();
                                }
                            }
                        }
                    });
                    $(this).next('footer')
                        .prepend('<div class="progress"><span class="hidden">In progress</span></div>');
                    // On empêche le navigateur d'envoyer le submit
                    return false;
                });
            });
        }
        load_in_popup();
        // On gère les click sur les a.popup
        $('#popup').on('click', 'a.popup', function(e) {
            var old_link = link;
            link = $(this).attr('href');
            $('#popup').empty();
            load_in_popup();
            return false;
        });
		// on empêche le navigateur de suivre le lien
		e.preventDefault();
		$('#overlay').click(close_overlay);
	});


    // Masquage automatique des panneaux
	$('#left').click(function() {
		// Si le panneau était ouvert on le ferme
		if ($('#left_panel').css('left') != '-300px') {
			// On ferme le panneau
			$('#left_panel').animate({ left: '-300px' , opacity: '0.6' ,
                transition: '1s left, 1s opacity'});

			// On agrandi la section
			$('section').animate({ left: '3px', transition: '1s left'}, justify_thumb);
            // On justifie les vignettes
            justify_thumb();
		}
		else {
			// On ouvre le panneau
			$('#left_panel').animate({ left: '3px' , opacity: '1' ,
                transition: '1s left, 1s opacity' });
			// On diminue la section
			$('section').animate({ left: '306px', transition: '1s left' }, justify_thumb);
		}
		// On empêche le navigateur de suivre le lien :
		return false;
	});

    // Rating des images
    function rate_thumb() {
        $('footer').on('click', 'a.star, a.point', function(e) {
            // On défini le lien
            var link = $(this).attr('href');
            $(this).parent().load(link);
            // on empêche le navigateur de suivre le lien
            e.preventDefault();
        });
    }

    // Justify librairy thumbnails
    justify_thumb();
    rate_thumb();
    // Rejustify librairy thumbnails on window resize
    $(window).resize(justify_thumb);


    ////////////////
    // selectable //
    ////////////////

    /*
     * Selected elements get 'selected' class
     * Active element (more selected than others) gets 'active' class
     * and is always at index 0 of selected[selectable] array for drag & drop
     * to target wich needs only one element to act on good one.
     */

    // selectable init
    function selectable_init() {
        // create global selected object
        selected = {thumb: []};
        // create ctrl touch variable
        ctrl_down = false;
    }

    // get index of given id in selected[selectable] array
    function getIndex(id, selectable) {
        for (var i in selected[selectable]) {
            if (selected[selectable][i] == id) {
                return i;
            }
        }
        return -1;
    }

    // selectable click
    function selectable_click(event) {
        var id = $(this).attr('id');
        var selectable = $(this).attr('data-selectable');
        var n_selected = selected[selectable].length;

        function unselectAll() {
            for (var i = 0; i < n_selected; i++) {
                    $('#' + selected[selectable][i]).removeClass('selected active');
            }
            selected[selectable] = [];
        }

        function selectElement(id) {
            if (!$('#' + id).hasClass('selected')) {
                $('#' + id).addClass('selected');
                selected[selectable].push(id);
                n_selected = selected[selectable].length;
            }
        }

        function unselectElement(id) {
            $('#' + id).removeClass('selected active');
            var index = getIndex(id, selectable);
            if (index == 0) {
                selected[selectable].shift();
                n_selected = selected[selectable].length;
            }
            else if (index == n_selected - 1) {
                selected[selectable].pop();
                n_selected = selected[selectable].length;
            }
            else if (index != -1) {
                var half_one = selected[selectable].slice(0, index);
                var half_two = selected[selectable].slice(index + 1);
                selected[selectable] = half_one.concat(half_two);
                n_selected = selected[selectable].length;
            }
        }

        function selectClicked() {
            // if element is not the only selected or is not selected
            if ((n_selected > 1 && $(this).hasClass('selected')) || (!$(this).hasClass('selected'))) {
                unselectAll();
                selectElement(id);
            }
        }

        // with shift key
        if (event.shiftKey) {
            //console.log('shift');
            if (n_selected < 1 || $(this).hasClass('active')) {
                // normal click behavior
                selectClicked();
            }
            else {
                // if only one element is selected it becomes active
                if (n_selected == 1) {
                    $('[data-selectable="' + selectable + '"].selected').addClass('active');
                }
                var id_active = $('[data-selectable="' + selectable + '"].active').attr('id');

                function selectBetween(clicked, direction) {
                    unselectAll();
                    selectElement(id_active);
                    selectElement(clicked.attr('id'));
                    $('#' + id_active).addClass('active');
                    if (direction == 'prev') {
                        clicked.prevUntil('[data-selectable="' + selectable + '"].active').addClass('selected');
                    }
                    else if (direction == 'next') {
                        clicked.nextUntil('[data-selectable="' + selectable + '"].active').addClass('selected');
                    }
                    selected[selectable] = [id_active];
                    $('[data-selectable="' + selectable + '"].selected').not('#' + id_active).each(function() {
                        selected[selectable].push($(this).attr('id'));
                    });
                }
                // select all elements between active and clicked ones
                if ($(this).prevAll('[data-selectable="' + selectable + '"].active').length != 0) {
                    //console.log('prev');
                    selectBetween($(this), 'prev');
                }
                else {
                    //console.log('next');
                    selectBetween($(this), 'next');
                }
            }
        }
        // with ctrl key
        else if (event.ctrlKey) {
            // if element is selected, unselect it
            if ($(this).hasClass('selected')) {
                // if element is active, active next element
                if ($(this).hasClass('active')) {
                    $(this).nextAll('[data-selectable="' + selectable + '"].selected').first().addClass('active');
                }
                unselectElement(id);
                if (n_selected == 1) {
                    // if element is the only which stays selected, remove active class
                    $('[data-selectable="' + selectable + '"].selected.active').removeClass('active');
                }
            }
            else {
                // if element is second selected, add active class to first
                if (n_selected == 1) {
                    $('#' + selected[selectable][0]).addClass('active');
                }
                selectElement(id);
            }
        }
        // no mod key
        else {
            //console.log('no_mod');
            selectClicked();
        }
    }

    function activate(event) {
        if (!event.shiftKey) {
            var element = $(this).parents().closest('article');
            var selectable = element.attr('data-selectable');
            var n_selected = selected[selectable].length;
            if (element.hasClass('selected') && !element.hasClass('active') && n_selected > 1) {
                var old_active = selected[selectable][0]; // id of actually active element
                var new_active = element.attr('id');
                var new_active_index = getIndex(new_active, selectable);

                // move new active element to index 0 and old active element
                selected[selectable][0] = new_active;
                selected[selectable][new_active_index] = old_active;

                $('#' + old_active).removeClass('active');
                element.addClass('active');
                return false;
            }
        }
        event.preventDefault();
    }

    function selectAll(event) {
        var A = 65;

        if (ctrl_down && (event.keyCode == A)) {
            var selectable = 'thumb'; // selectable elements to select on ctrl + a
            var n_selected = selected[selectable].length;
            var id_active;

            // if at least one element is already selected, first one becomes active
            if (n_selected > 0) {
                id_active = selected[selectable][0];
                $('#' + selected[selectable][0]).addClass('active');
            }
            // else first selectable element becomes active
            else {
                id_active = $('[data-selectable="' + selectable + '"]').first().attr('id');
                $('#' + id_active).addClass('active');
            }

            // select all
            selected[selectable] = [id_active];
            $('[data-selectable="' + selectable + '"]').addClass('selected');
            $('[data-selectable="' + selectable + '"]').not('#' + id_active).each(function() {
                selected[selectable].push($(this).attr('id'));
            });

            // to avoid browser text selection
            event.preventDefault();
            return false;
        }
    }

    selectable_init();
    $('body').on('click', '[data-selectable]', selectable_click).find('article.thumb img').click(activate);
    $(document).on('keydown', function(event) {
        if (event.ctrlKey) {
            ctrl_down = true;
            selectAll(event);
        }
    }).on('keyup', function(event) {
        var CTRL = 17;

        if (event.ctrlKey || event.keyCode == CTRL) {
            ctrl_down = false;
        }
    });

    /////////////////
    //    drag     //
    /////////////////

    var mousedown = false;
    var draggable;
    var mousex;
    var mousey;
    var src;
    var lasthover; // last element hovered during drag
    var sort_space = 15; // space in px to put between sortable elements on hover
    var coordinates = [];

    // cursor
    function cursor_img(src, multiple) {
        $('body').prepend('<div id="cursor_img"><img src="' + src + '" /></div>');
        var width = $('#cursor_img img').width();
        var height = $('#cursor_img img').height();
        var position = $('#cursor_img img').position();

        $('#cursor_img').hide();
        if (multiple) {
            $('#cursor_img').append('<div class="cursor-multiple"></div><div class="cursor-multiple2"></div>');
            $('#cursor_img .cursor-multiple, #cursor_img .cursor-multiple2').css('width', width).css('height', height);
            $('#cursor_img .cursor-multiple').css('left', position.left + 6).css('top', position.top + 6);
            $('#cursor_img .cursor-multiple2').css('left', position.left + 12).css('top', position.top + 12);
        }
        $(document).mousemove(function(event) {
            $('#cursor_img').css('left', event.clientX - 75).css('top', event.clientY - 50).show();
            $('#cursor_img img').on('dragstart', function(event) { event.preventDefault(); });
        });
    }


    var continueDragging = function(e) {
        // check if we roll out an event element
        if (lasthover != null) {
            if (mousex < lasthover.left || mousex > lasthover.right || mousey < lasthover.top || mousey > lasthover.bottom) {
                if (lasthover.sortable) {
                    // put size and margin back
                    var id = lasthover.dom.attr('id');
                    var new_width = $('#' + id + ' div.thumb-container').width() + sort_space;
                    var size_picture = new_width - 24;
                    lasthover.dom.css('margin-left', '3px').css('margin-right', '0px');
                    $('#' + id + ' div.thumb-container').css('width', new_width);
                    $('#' + id + ' img.thumbnail').css('max-width', size_picture);
                }
                if (lasthover.droppable) {
                    // remove class
                    lasthover.dom.removeClass('diahover');
                }
                // reset lasthover
                lasthover = null;
            }
        }
        // check if we rollover an event element
        for (var i in coordinates) {
            if (mousex >= coordinates[i].left && mousex <= coordinates[i].right) {
                if (mousey >= coordinates[i].top && mousey <= coordinates[i].bottom) {
                    if (lasthover == null || coordinates[i].dom != lasthover.dom) {
                        if (coordinates[i].sortable) {
                            // we are on a sortable element
                            var id = coordinates[i].dom.attr('id');
                            var width = coordinates[i].dom.width();
                            var new_width = $('#' + id + ' div.thumb-container').width() - sort_space;
                            var size_picture = new_width - 24;
                            $('#' + id + ' div.thumb-container').css('width', new_width);
                            $('#' + id + ' img.thumbnail').css('max-width', size_picture);
                            // check if mouse is on right or left part of element
                            //if (mousex > (coordinates[i].left + (width / 2))) {
                                coordinates[i].dom.css('margin-right', sort_space);
                            //}
                            //else {
                            //    coordinates[i].dom.css('margin-left', sort_space + 3);
                            //}
                        }
                        else if (coordinates[i].droppable) {
                            // we are on a droppable element
                            // change cursor for drag one
                            coordinates[i].dom.addClass('diahover');
                        }

                        // store new hovered element
                        lasthover = coordinates[i];
                    }
                    // stop loop when hovered element is found
                    break;
                }
            }
        }

        // save last mouse position
        mousex = e.pageX;
        mousey = e.pageY;
    };

    var endDragging = function(e) {
        // Check if we are on an event element
        for (var i in coordinates) {
            if (mousex >= coordinates[i].left && mousex <= coordinates[i].right) {
                if (mousey >= coordinates[i].top && mousey <= coordinates[i].bottom) {
                    if (coordinates[i].sortable) {
                        // give back normal size to hovered element
                        coordinates[i].dom.css('margin-right', '0px').css('margin-left', '3px');
                        justify_thumb();
                        // reorder elements
                        var move;
                        if ($('#' + mousedown).hasClass('selected')) {
                            move = $('[data-draggable].selected').detach();
                        }
                        else {
                            move = $('#' + mousedown).detach();
                        }
                        move.insertAfter(coordinates[i].dom);
                        var order = [];
                        $('[data-sortable="' + draggable + '"]').each(function() {
                            order.push($(this).attr('id'));
                        });
                        // send element order to serveur
                        var link = window.location.pathname + 'order/';
                        $.ajax({
                            type: 'POST',
                            url: link,
                            data: {arr: order}, // array to pass to django
                            error: function(data) {alert(data);}
                        });
                    }
                    else if (coordinates[i].droppable) {
                        // send table with dragged elements to serveur
                        var link = coordinates[i].dom.attr('href') + 'add/';
                        if ($('#' + mousedown).hasClass('selected')) {
                            array = selected[draggable];
                        }
                        else {
                            array = [mousedown];
                        }
                        // to keep access to variable in success function
                        var drag = draggable;
                        var dom = coordinates[i].dom;
                        $.ajax({
                            type: 'POST',
                            url: link,
                            data: {arr: array}, // array to pass to django
                            success: function(data) {
                                if (drag == 'thumb') {
                                    dom.children('span.count').html(data);
                                }
                            },
                            error: function(data) {alert(data);}
                        });

                        // remove active class
                        coordinates[i].dom.removeClass('diahover');
                    }
                    // stop loop when hovered element is found
                    break;
                }
            }
        }

        // reset variables
        mousedown = false;
        draggable = null;
        src = null;
        lasthovered = null;
        mousex = 0;
        mousey = 0;
        coordinates = [];
        // remove cursor_img
        $('#cursor_img').remove();

        // Remove document event listeners
        $(document).unbind('mousemove', continueDragging);
        $(document).unbind('mouseup', endDragging);
    };

    var startDragging = function(e) {
        draggable = $(this).attr('data-draggable');
        mousedown = $(this).attr('id');
        src = $(this).find('img').attr('src');
        lasthover = $(this);

        if ($(this).hasClass('selected')) {
            var selectable = $(this).attr('data-selectable');
            var n_selected = selected[selectable].length;
        }

        if (n_selected && n_selected > 1) {
            // cursor multiple
            cursor_img(src, true);
        }
        else {
            // cursor simple
            cursor_img(src, false);
        }

        // find coordinates of droppable elements
        $('[data-droppable="' + draggable + '"]').not($(this)).each(function() {
            var lefttop = $(this).offset();
            // save them for later access
            if ($(this).is(':visible')) {
                coordinates.push({
                    dom: $(this),
                    left: lefttop.left,
                    top: lefttop.top,
                    right: lefttop.left + $(this).width(),
                    bottom: lefttop.top + $(this).height(),
                    droppable: true
                });
            }
        });

        // find coordinates of sortable elements
        $('[data-sortable="' + draggable + '"]').not($(this)).each(function() {
            var lefttop = $(this).offset();
            // save them for later access
            coordinates.push({
                dom: $(this),
                left: lefttop.left,
                top: lefttop.top,
                right: lefttop.left + $(this).width(),
                bottom: lefttop.top + $(this).height(),
                sortable: true
            });
        });

        // Bind events for dragging and stopping
        $(document).bind('mousemove', continueDragging);
        $(document).bind('mouseup', endDragging);
    };

    // start the dragging
    $('[data-draggable]').on('mousedown', startDragging);

    // to prevent images native drag
    $('[data-draggable] img').on('dragstart', function(event) { event.preventDefault(); });




    ////////////////
    // lightbox   //
    ////////////////

    // delete buttons event
    function delete_buttons_events() {
        //console.log('delete_buttons');
        $('#lightbox-image').off('click', '#lightbox-next');
        $('#lightbox-image').off('click', '#lightbox-prev');
        $(document).off('keydown');
        // delete buttons
        $('#lightbox-next, #lightbox-prev').remove();
    }

    // closer
    function lb_stop() {
        // fade lightbox out
        //console.log('stop');
        // delete buttons events
        delete_buttons_events();
        $('#lightbox').fadeOut('normal', function() {
            // remove lightbox
            $('#lightbox').remove();
            // fade overlay out
            $('#overlay').fadeOut();
        });
        // remove hashtag
        parent.location.hash = '';
        return false;
    }


    function lb_listen_keyboard() {
        // enable keyboard navigation
        var LEFT = 37; // left arrow for previous picture
        var RIGHT = 39; // right arrow for next picture
        var ESCAPE = 27; // for Quit lightbox
        var SPACE = 32; // for next picture
        var Q = 81; // for Quit lightbox
        var BACKSPACE = 8; // for previous picture
        var N = 78; // for Next picture
        var P = 80; // for Previous picture

        $(document).on('keydown', function(event) {
            if (event.keyCode == RIGHT || event.keyCode == SPACE || event.keyCode == N) {
                $('#lightbox-next').click();
            }
            else if (event.keyCode == LEFT || event.keyCode == BACKSPACE || event.keyCode == P) {
                $('#lightbox-prev').click();
            }
            else if (event.keyCode == ESCAPE || event.keyCode == Q) {
                lb_stop();
            }
        });
    }

    function lb_listen_click(lb_image) {
        // enable click navigation
        // get previous picture index
        // if not first picture
        if (lb_image.current_pict > 0) {
            var prev = lb_image.current_pict - 1;
        } else { // else go to last one
            var prev = lb_image.pict.length - 1;
        }

        // get next picture index
        // if not last picture
        if (lb_image.current_pict < (lb_image.pict.length - 1)) {
            var next = lb_image.current_pict + 1;
        } else { // else go to first one
            var next = 0;
        }

        // get cache for next picture
        var cache_next = $('<img id="' + lb_image.pict[next].id + '" src="' + lb_image.pict[next].href + '" alt="' + lb_image.pict[next].title + '"  />');
        // get cache for previous picture
        var cache_prev = $('<img  id="' + lb_image.pict[prev].id + '"src="' + lb_image.pict[prev].href + '" alt="' + lb_image.pict[prev].title + '"  />');

        // listen on next event
        //console.log('listen click next');
        $('#lb-new').on('click', '#lightbox-next', function(event) {
            //console.log('next :'+(next+1));
            // delete buttons event
            delete_buttons_events();
            // change figure id
            $('#lb-new').attr('id', 'lb-old');
            // show next image
            lb_image.current_pict = next;
            lb_show(lb_image, cache_next);
        });

        // listen on previous event
        //console.log('listen click prev');
        $('#lb-new').on('click', '#lightbox-prev', function(event) {
            //console.log('prev: '+(prev+1));
            // delete buttons event
            delete_buttons_events();
            // change figure id
            $('#lb-new').attr('id', 'lb-old');
            // show previous image
            lb_image.current_pict = prev;
            lb_show(lb_image, cache_prev);
        });

        // stop lightbox at overlay's click
        $('#lightbox').click(lb_stop).children().click(function(e) {
            //console.log('childrenfalse');
            return false;
        });
    }

    // show
    function lb_show(lb_image, cache) {
        // get window visible width & width
        var cur = lb_image.current_pict;
        var max_width = $(window).width() - 80;
        var max_height = $(window).height() - 100;
        // load image
        if (typeof cache == 'undefined') {
            var cache = $('<img id="' + lb_image.pict[cur].id + '" src="' + lb_image.pict[cur].href + '" alt="' + lb_image.pict[cur].title + '"  />');
        }
        var content = $('<div class="lb-buttons-wrapper"></div><figcaption>' + lb_image.pict[cur].title + '<p>Image ' + (cur + 1) + ' of ' + lb_image.pict.length + '</p></figcaption');

        // load image in lighbox
        cache.one('load', function() {
            //console.log('load');
            // add new figure to html
            $('#lightbox').prepend('<figure id="lb-new" class="lb-image"></figure>');
            // hide new figure
            $('#lb-new').hide();
            // append content in new figure
            $('#lb-new').append(content);
            // append image
            $('#lb-new .lb-buttons-wrapper').append(cache);
            // add next and prev buttons with event listeners if several images,
            if (lb_image.pict.length > 1) {
                //console.log('add buttons');
                $('.lb-buttons-wrapper').append('<button id="lightbox-prev">Previous image</button>');
                $('.lb-buttons-wrapper').append('<button id="lightbox-next">Next image</button>');
            }
            lb_listen_click(lb_image);
            lb_listen_keyboard();
            // give max dimentions to image and 0 opacity to get picture width (only available if visible)
            $('#lb-new').css('opacity', '0').show();
            $('#lb-new img').css('max-width', max_width).css('max-height', max_height);
            var pict_width = $('#lb-new img').width();
            var pict_height = $('#lb-new img').height();
            // give width to figure and figcaption
            $('#lb-new, #lb-new figcation').css('width', pict_width + 4);
            // center figure
            $('#lb-new').css({'left': '50%', 'margin-left': -(pict_width + 4) / 2});
            // hide figure and give back normal opacity
            // add max width to figcation (else legend can be larger than picture width)
            $('#lb-new').hide().css('opacity', '1');
            // if any, fade old figure out then remove it
            if ($('#lb-old').length != 0) {
                $('#lb-old').fadeOut(lb_image.fadeDuration, function() {
                    // when fadeOut is finished remove it
                    $(this).remove();
                    //console.log('remove');
                });
            }
            // fade new lightbox in
            $('#lb-new').fadeIn(lb_image.fadeDuration);
        }).each(function() {
            // if image is already loaded, trigger load event
            if (this.complete) {
                //console.log('triggerload');
                $(this).trigger('load');
            }
        });
        // add hashtag to url when image is loaded
        document.location.hash = '/lightbox/' + lb_image.pict[cur].id + '/';
    }

    // launcher
    function lb_start() {
        // get lightbox id (in case several lightboxes in document)
        var lb_id = $(this).attr('data-lightbox');
        // get current picture position in lightbox
        var current_pict = $(this).parents().prevAll().find('a[data-lightbox="' + lb_id + '"]').length;
        // add all lightbox picture in a table
        var pict = [];
        $('a[data-lightbox="' + lb_id + '"]').each(function() {
            data = {
                id: $(this).attr('id'),
                href: $(this).attr('href'),
                title: $('img', this).attr('alt')
            };
            pict.push(data);
        });

        // create litteral object with data
        var lb_image = {
            id: lb_id,
            current_pict: current_pict,
            pict: pict,
            fadeDuration: 1500
        };

        // add overlay
        $('#overlay').addClass('dark').fadeIn(function() {
            // add lightbox container
            $('body').prepend('<section id="lightbox"></section>');
            // show image
            lb_show(lb_image);
        });

        return false;
    }

    // launch lightbox
    $('body').on('click', 'a[data-lightbox]', lb_start);

    // Fonction to remove trailing slash
    function stripTrailingSlash(str) {
        if (str.substr(-1) == '/') {
            return str.substr(0, str.length - 1);
        }
        return str;
    }
    // Fonction on surveille les ancres, et si elles commencent par #/lightbox/id/ on simule un clic sur l'image id
    if (window.location.hash.substring(0, 11) == '#/lightbox/') {
        var id = stripTrailingSlash(window.location.hash.substring(11));
        $('#' + id).click();
    }
});
