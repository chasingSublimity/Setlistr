# Setlistr
The bands that I play with never remember to write out setlists. Using this tool allows users to create, edit, and access a common setlist; all which update the database asynchronously.

## Technology Used
HTML, CSS, JavaScript, jQuery, Node, Express, MongoDB

## Summary
The user adds the first track, which creates the setlist in the database. Afterwards, the user may add additional tracks, and edit/rearrange tracks. All of these actions update the database without any 'save' action required from the user

### Adding Tracks
Users add tracks with the input fields at the top of the app. The "Key" input accepts: A-G, a-g, #, and ♮. The "BPM" input accepts numbers from 1 to 350bpm. All fields are required.
<br/>
![add track video](https://github.com/chasingSublimity/Setlistr/blob/master/readme-videos/add-track.gif)

### Editing Tracks
Users edit tracks by clicking either the track name, key, or bpm and entering new information. 
<br/>
![edit track video](https://github.com/chasingSublimity/Setlistr/blob/master/readme-videos/edit-track.gif)

### Rearranging Tracks
Users rearrange the setlist by dragging and dropping the tracks.
<br/>
![rearrange track video](https://github.com/chasingSublimity/Setlistr/blob/master/readme-videos/rearrange-track.gif)

### Deleting Tracks
Users delete tracks by clicking the red x to the left of the track name and then confirming their action.
<br/>
![delete track video](https://github.com/chasingSublimity/Setlistr/blob/master/readme-videos/delete-track.gif)