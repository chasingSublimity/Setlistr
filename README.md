# Setlistr
The bands that I play with never remember to write out setlists. Using this tool allows users to create, edit, and access a common setlist; all which update the database asynchronously.

## Technology Used
HTML, CSS, JavaScript, jQuery, Node, Express, MongoDB

## Summary
The user adds the first track, which creates the setlist in the database. Afterwards, the user may add additional tracks, and edit/rearrange tracks. All of these actions update the database without any 'save' action required from the user

### Adding Tracks
Users add tracks with the input fields at the top of the app. The "Key" input accepts: A-G, a-g, #, and ♮. The "BPM" input accepts numbers from 1 to 350bpm. All fields are required.
![Add Track Gif](https://github.com/chasingSublimity/capstone-two/yadayadayada)

### Editing Tracks
Users edit tracks by clicking either the track name, key, or bpm and entering new information. 
![Edit Track Gif](https://github.com/chasingSublimity/capstone-two/yadayadayada)

### Rearranging Tracks
Users rearrange the setlist by dragging and dropping the tracks.
![Rearrange Track Gif](https://github.com/chasingSublimity/capstone-two/yadayadayada)

### Deleting Tracks
Users delete tracks by clicking the red x to the left of the track name and then confirming their action.
![Delte Track Gif](https://github.com/chasingSublimity/capstone-two/yadayadayada)
