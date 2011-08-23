var mediaData = [{
  "id": 1,
	"title": "Viewpoint A",
	"in": 0,
	"duration": 30
}, {
  "id": 2,
  "title": "Viewpoint B",
	"in": 20,
	"duration": 20
}, {
  "id": 3,
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
	
	describe("shouldBePlaying", function() {
	  
	  it("should be playing at t=in", function() {
	    expect(this.mediaclip.shouldBePlaying(0)).toBeTruthy();
	  });
	  
	  it("should be playing at in < t < duration", function() {
	    expect(this.mediaclip.shouldBePlaying(5)).toBeTruthy();
	  });
	  
	  it("should not be playing at t=duration", function() {
	    expect(this.mediaclip.shouldBePlaying(30)).toBeFalsy();
	  });
	  
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
  
  describe("playback predicates", function() {
    
    beforeEach(function() {
      this.player = new Player();
    });
    
    it("correctly reports play state", function() {
      expect(this.player.isPlaying()).toBeFalsy();
    });
    
    it("correctly reports stop state", function() {
      expect(this.player.isStopped()).toBeTruthy();
    });
    
    it("gets stopped by stop event", function() {
      this.player.stop();
      expect(this.player.isStopped()).toBeTruthy();
    });
    
    it("gets played by play event", function() {
      this.player.play();
      expect(this.player.isPlaying()).toBeTruthy();
    });
    
  });
	
	describe("belonging to a MediaClip", function() {
		
		beforeEach(function() {
			this.mediaclip = new MediaClip(mediaData[0]);
		});
		
		it("should be accessible from MediaClip", function() {
			expect(this.mediaclip.player).toBeDefined();
		});
		
	});
	
});

describe("Master Timeline", function() {
	
	beforeEach(function() {
		this.mediaclips = new MediaClips(mediaData);
		this.master = new Master({mediaclips: this.mediaclips});
	});
	
	it("starts at t=0", function() {
    expect(this.master.get('time')).toEqual(0);
	});
	
	it("inherits duration from MediaClips", function() {
		expect(this.master.get('duration')).toEqual(80);
	});
	
	it("should not be playing by default", function() {
	  expect(this.master.isStopped()).toBeTruthy();
	});
	
	describe("playback controls", function() {
	  
	  it("should play through the play method", function() {
	    this.master.play();
	    expect(this.master.isPlaying()).toBeTruthy();
	  });
	  
	  it("should stop through the stop method", function() {
	    this.master.stop();
	    expect(this.master.isStopped()).toBeTruthy();
	  });
	  
	});
	
	describe("playing", function() {
	  
	  beforeEach(function() {
	    this.master.play();
	  });
	  
	  describe("t=0", function() {

  	  it("A is playing", function() {
  	    expect(this.master.mediaclips.get(1).player.isPlaying()).toBeTruthy();
  	  });
  	  
  	  it("B is stopped", function() {
  	    expect(this.master.mediaclips.get(2).player.isPlaying()).toBeFalsy();
  	  });
  	  
  	  it("C is playing", function() {
        expect(this.master.mediaclips.get(3).player.isPlaying()).toBeTruthy();
  	  });
  	  
	  });
	  
	  describe("t=30", function() {
	    
	    beforeEach(function() {
        this.master.set({time: 30});
	    });

  	  it("A has stopped", function() {
  	    expect(this.master.mediaclips.get(1).player.isPlaying()).toBeFalsy();
  	  });
  	  
  	  it("B is playing", function() {
  	    expect(this.master.mediaclips.get(2).player.isPlaying()).toBeTruthy();
  	  });
  	  
  	  it("C is playing", function() {
        expect(this.master.mediaclips.get(3).player.isPlaying()).toBeTruthy();
  	  });
  	  
	  });
	  
	  describe("t=40", function() {
	    
	    beforeEach(function() {
        this.master.set({time: 40});
	    });

  	  it("A has stopped", function() {
  	    expect(this.master.mediaclips.get(1).player.isPlaying()).toBeFalsy();
  	  });
  	  
  	  it("B has stopped", function() {
  	    expect(this.master.mediaclips.get(2).player.isPlaying()).toBeFalsy();
  	  });
  	  
  	  it("C is playing", function() {
        expect(this.master.mediaclips.get(3).player.isPlaying()).toBeTruthy();
  	  });
  	  
	  });
	  
	  describe("t=80", function() {
	    
	    beforeEach(function() {
        this.master.set({time: 80});
	    });

  	  it("A has stopped", function() {
  	    expect(this.master.mediaclips.get(1).player.isPlaying()).toBeFalsy();
  	  });
  	  
  	  it("B has stopped", function() {
  	    expect(this.master.mediaclips.get(2).player.isPlaying()).toBeFalsy();
  	  });
  	  
  	  it("C has stopped", function() {
        expect(this.master.mediaclips.get(3).player.isPlaying()).toBeFalsy();
  	  });
  	  
	  });
	  
	});
	
});
