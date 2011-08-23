var mediaData = [{
	"title": "Viewpoint A",
	"in": 0,
	"duration": 30
}, {
	"title": "Viewpoint B",
	"in": 20,
	"duration": 20
}, {
	"title": "Viewpoint C",
	"in": 0,
	"duration": 80
}];

describe ("MediaClip", function() {
	
	beforeEach(function() {
		this.mediaclip = new MediaClip(mediaData[0]);
	});
	
	it("creates from data", function() {
		expect(this.mediaclip.get('duration')).toEqual(30);
	});
	
	it("should return relative endtime", function() {
		expect(this.mediaclip.relativeEnd()).toEqual(30);
	});

});

describe("MediaClips", function() {
	
	beforeEach(function() {
		this.mediaclips = new MediaClips();
		this.mediaclips.add(mediaData[0]);
	});
	
	it("has models", function() {
		expect(this.mediaclips.models.length).toEqual(1);
	});

	it("calculates master length for one clip", function() {
		expect(this.mediaclips.masterLength()).toEqual(30);
	});
	
	  	it("calculates master length for two overlaying clips", function() {
		this.mediaclips.add(mediaData[1]);
		expect(this.mediaclips.masterLength()).toEqual(40);
	});
	
	it("calculates master length for a complex overlap of clips", function() {
		this.mediaclips.add(mediaData[1]);
		this.mediaclips.add(mediaData[2]);
		expect(this.mediaclips.masterLength()).toEqual(80);
	});
  	
});

describe("Player", function() {
	
	describe("belonging to a MediaClipView", function() {
		
		beforeEach(function() {
			this.player = new Player();
			this.mediaclip = new MediaClip(mediaData[0]);
			this.mediaclipview = new MediaClipView({
				model: this.mediaclip,
				player: this.player
			});
		});
		
		it("should be accessible from MediaClip", function() {
			expect(this.mediaclipview.player).toBe(this.player);
		});
		
	});
	
});
