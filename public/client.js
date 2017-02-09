var SetList = {};


// Drag-n-Drop functionality
// SetList.dragSource = {};

// SetList.isbefore = function(a, b) {
//     if (a.parentNode == b.parentNode) {
//         for (var cur = a; cur; cur = cur.previousSibling) {
//             if (cur === b) { 
//                 return true;
//             }
//         }
//     }
//     return false;
// };

// SetList.dragenter = function(e) {
//     if (SetList.isbefore(dragSource, e.target)) {
//         e.target.parentNode.insertBefore(dragSource, e.target);
//     }
//     else {
//         e.target.parentNode.insertBefore(dragSource, e.target.nextSibling);
//     }
// };

// SetList.dragstart = function(e) {
//     dragSource = e.target;
//     e.dataTransfer.effectAllowed = 'move';
// };



// functions to set state with API data

// save setlist to sessionStorage so that other functions can access it
// function saveToSessionStorage(data) {	
// 	sessionStorage.setlist = JSON.stringify(data);
// }

// api calls

// get existing setlist
SetList.getSetlist = function(callbackFn) {
	$.get('/setlist', function(data) {
		callbackFn(data);
		// saveToSessionStorage(data);
	});
};

// post new setlist
SetList.postNewTrack = function(newTrack) {
	$.ajax({
	  type: "POST",
	  url: '/track',
	  data: JSON.stringify({track: newTrack}),
	  success: console.log('setlist posted'),
	  contentType: 'application/json',
	  dataType: 'json'
	});
};

// edit existing setlist
SetList.editTrack = function(track) {
		$.ajax({
	  type: "PUT",
	  url: '/track/' + track._id, 
	  data: JSON.stringify(setlist),
	  success: console.log('setlist posted'),
	  contentType: 'application/json',
	  dataType: 'json'
	});
};

// delete existing setlist
SetList.deleteSetlist = function(setlist) {
		$.ajax({
	  type: "DELETE",
	  url: '/setlist/' + track._id,
	  data: JSON.stringify(setlist),
	  success: console.log('setlist deleted'),
	  contentType: 'application/json',
	  dataType: 'json'
	});
};

// rendering functions

SetList.renderSetlist = function(apiResponse) {
		if (apiResponse === null) {
			// display instructions if no setlist has been created
			$('.setlist').html('<p class="noSetlistMessage">Add a track above to get started!</p>');
		} else {
			// display setlist if it has been created
			var setlistHtml = [];
			for (var i=0; i < apiResponse.tracks.length; i++) {
				var song = apiResponse.tracks[i];
				setlistHtml.push(
					'<div class="track-item-container">' +
						'<input type="image" src="./assets/red-x.jpg" alt="delete button" name="delete-button" class="delete-button">' +
						'<p class="track">' + '<strong><span onclick="this.contentEditable=true;this.focus()">' + song.trackName + '</span> -  <span onclick="this.contentEditable=true;this.focus()">' + song.key + '</span> - <span onclick="this.contentEditable=true;this.focus()">' + song.bpm + '</span></strong></p>' + 
					'</div>'
				);
			}
			$('.setlist').append(setlistHtml);
		}
};

// render track data
SetList.renderNewTrack = function(song) {
	// if UI is displaying the instructions, clear the .setlist div
	if ($('.setlist').html() === '<p class="noSetlistMessage">Add a track above to get started!</p>') {
		$('.setlist').html('');
	} 
	var trackString = (
		'<div class="track-item-container">' +
			'<input type="image" src="./assets/red-x.jpg" alt="delete button" name="delete-button" class="delete-button">' +
			// use span tags and regex
			'<p class="track">' + '<strong><span onclick="this.contentEditable=true;this.focus()">' + song.trackName + '</span> -  <span onclick="this.contentEditable=true;this.focus()">' + song.key + '</span> - <span onclick="this.contentEditable=true;this.focus()">' + song.bpm + '</span></strong></p>' + 
		'</div>'
	);
	$('.setlist').append(trackString);
};

// event listeners
SetList.watchAddTrack = function() {
	$('form').on('submit', function(event) {
		event.preventDefault();
		var form = $(this);
		var song = {
			trackName: form.find('#title').val(),
			key: form.find('#key').val(),
			bpm: form.find('#tempo').val()
		};
		// render data on page
		SetList.renderNewTrack(song);
		// send data to DB
		SetList.postNewTrack(song);
		// reset UI
		$('input').val('');
	});
};

SetList.watchUpdateTrack = function() {
	// update on ui using sortable library
	var el = document.getElementById('sortable-setlist');

	Sortable.create(el, {
		animation: 250
	});
	// update on DB
};

SetList.watchDeleteTrack = function() {
	// delete from UI
	$(document).on('click', '.delete-button', function(event) {
		$(this).parent('div').remove();
	});
	// delete from DB	
};

$(function() {
	SetList.getSetlist(SetList.renderSetlist);
	SetList.watchAddTrack();
	SetList.watchUpdateTrack();
	SetList.watchDeleteTrack();
});