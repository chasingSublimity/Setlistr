/* jshint esversion: 6 */
/* jshint expr: true */

// imports
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const should = chai.should();

const {Setlist} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
mongoose.Promise = global.Promise;

chai.use(chaiHttp);

// server config function
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}


// Generates a random musical key for seed function
function randomKeyGen() {
  var keys = "ABCDEFGabcdefg";
  var modality = "#b♮";
  return (keys.charAt(Math.floor(Math.random() * keys.length)) + 
  	modality.charAt(Math.floor(Math.random() * modality.length)));
}

// generates random setlist data

// break into two function
function generateSetlistData() {
	const setlistData = {tracks: []};
	for (let i = 1; i <= 7; i++) {
		setlistData.tracks.push({
			trackName: faker.name.firstName(),
			bpm: Math.floor(Math.random() * (350 - 1 + 1)) + 1,
			key: randomKeyGen(),
		});
	}
	return setlistData;
}


// seeds DB with fake data
function seedTrackData() {
	console.info('seeding track data');
	const seedData = generateSetlistData();
	return Setlist.create(seedData);
}

// tests
describe('Setlist Generator', function() {

	// hooks
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedTrackData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	describe('GET root endpoint', function() {
		it('should return 200 status code and HTML file', function() {
			return chai.request(app)
				.get('/')
				.then(function(res) {
					res.should.have.status(200);
					res.should.contain.html;
				});
		});
	});

	describe('GET requests to /setlist', function() {
		it('should return a json object with an array of strings representing track information', function() {
			return chai.request(app)
				.get('/setlist')
				.then(function(res) {
					const setlist = res.body.tracks;
					res.should.have.status(200);
					res.should.be.json;
					setlist.should.be.an.array;
					setlist.should.have.length.of.at.least(1);
					setlist.should.contain.instanceof(Object);
					setlist[0].should.contain.all.keys(['trackName', '_id']);
					setlist[0].trackName.should.be.a.string;
					setlist[0].key.should.be.a.string;
					setlist[0]._id.should.be.a.number;
					setlist[0].bpm.should.be.a.number;
					setlist[0].bpm.should.be.above(0).and.below(351);
				});
		});
	});

	describe('POST requests to /track', function() {
		it('should create a new track', function() {
			const newTrackData = {
				track:{
					trackName: faker.name.firstName(),
					bpm: Math.floor(Math.random() * (350 - 1 + 1)) + 1,
					key: randomKeyGen()
				}
			};
			return chai.request(app)
				.post('/track')
				.send(newTrackData)
				.then(function(res) {
					const lastSong = res.body.tracks[res.body.tracks.length-1];
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.an('object');
					res.body.tracks.should.be.an('array');
					res.body._id.should.not.be.null;
					res.body.tracks[0].should.include.keys('trackName', 'key', 'bpm');
					// set newTrackData._id to response.body._id so tests will pass
					newTrackData.track._id = lastSong._id;
					// check to see if the last item in the array matches the newTrackData
					lastSong.trackName.should.equal(newTrackData.track.trackName);
					lastSong.key.should.equal(newTrackData.track.key);
					lastSong.bpm.should.equal(newTrackData.track.bpm);
					return Setlist.findById(res.body._id);
				})
				.then(function(setlist){
					// check to see if the last item in the database array matches the newTrackData object generated above
					// add lastItemIndex variable
					const _lastSong = setlist.tracks[(setlist.tracks.length-1)];
					_lastSong.trackName.should.equal(newTrackData.track.trackName);
					_lastSong.key.should.equal(newTrackData.track.key);
					_lastSong.bpm.should.equal(newTrackData.track.bpm);
				});
		});
	});

	describe('PUT requests to /track/:id', function() {
		it('should update the data of a specified setlist', function() {
			// dummy data
			const updateData = {
				track:
					{
			      "trackName": "Green",
			      "bpm": 145,
			      "key": "G"
			    }
			};
			return Setlist
				// grab one setlist
				.findOne()
				.exec()
				.then(function(setlist) {
					// add id to update data
					updateData.track.id = setlist.tracks[0]._id;
					// make request
					return chai.request(app)
						.put(`/track/${updateData.track.id}`)
						.send(updateData);
				})
				.then(function(res) {
					res.should.have.status(204);
					// return the setlist in db
					return Setlist.findOne().exec();
				})
				.then(function(setlist) {
					// inspect the track to ensure that it was actually updated
					const updatedTrack = setlist.tracks[0];
					updatedTrack.key.should.equal(updateData.track.key);
					updatedTrack.bpm.should.equal(updateData.track.bpm);
				});
		});
	});

	describe('PUT requests to /setlist', function() {
		it('should reorder the tracks based on an array of track ids sent from the user', function() {
			let newSetlistOrder;
			// array scramble function
			function scrambleArray(array) {
			  var currentIndex = array.length, temporaryValue, randomIndex;
			  // While there remain elements to shuffle...
			  while (0 !== currentIndex) {
			    // Pick a remaining element...
			    randomIndex = Math.floor(Math.random() * currentIndex);
			    currentIndex -= 1;
			    // And swap it with the current element.
			    temporaryValue = array[currentIndex];
			    array[currentIndex] = array[randomIndex];
			    array[randomIndex] = temporaryValue;
			  }
			  return array;
			}
			return Setlist
				// grab setlist from DB and convert to promise
				.findOne()
				.exec()
				.then(function(setlist) {
					let originalOrder = [];
					// populate newSetlistOrder with ids from setlist
					setlist.tracks.forEach(track => {
						originalOrder.push(track._id);
					});
					// scramble array elements
					newSetlistOrder = scrambleArray(originalOrder);
					// make put request and return response
					return chai.request(app)
						.put(`/setlist`)
						.send({trackIds: newSetlistOrder});
				})
				.then(function(res) {
					res.should.have.status(204);
					// find and return setlist
					return Setlist.findOne().exec();
				})
				.then(function(setlist) {
					// check that the returned setlist order matches the 
					// order stored in newSetlistOrder
					setlist.tracks.should.equal.newSetlistOrder;
				});
		});
	});

	describe('DELETE requests to /track/:id', function() {
		it('should delete the specified track', function() {
			// declare variable here so that it is accessible in all of the functions below
			let track;
			let setLength;
			return Setlist
				.findOne()
				.exec()
				.then(function(setlist) {
					track = setlist.tracks[0];
					setLength = setlist.tracks.length;
					return chai.request(app).delete(`/track/${track._id}`);
				})
				.then(function(res) {
					res.should.have.status(204);
					return Setlist.findOne().exec();
				})
				.then(function(setlist){
					setlist.tracks.length.should.equal(setLength-1);
					setlist.tracks.should.not.contain(track);
				});
		});
	});

});

