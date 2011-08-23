(function($) {
	
	window.MediaClip = Backbone.Model.extend({

    initialize: function() {
      this.player = new Player();
    },
    
		relativeEnd: function() {
			return this.get('in') + this.get('duration');
		},
		
		shouldBePlaying: function(time) {
		  return (this.get('in') <= time && this.relativeEnd() > time);
		}
		
	});
	
	
	window.MediaClips = Backbone.Collection.extend({
		
		model: MediaClip,
		
		masterLength: function() {
			var last_clip = this.max(function(clip) {
				return clip.relativeEnd();
			});
			return last_clip.relativeEnd();
		},
		
		playClips: function(time) {
      _(this.shouldBePlaying(time)).each(function(clip) {
        clip.player.play();
      });

      _(this.shouldNotBePlaying(time)).each(function(clip) {
        clip.player.stop();
      });
		},
		
		shouldBePlaying: function(time) {
		  return this.select(function(clip) {
		    return clip.shouldBePlaying(time);
		  });
		},
		
		shouldNotBePlaying: function(time) {
		  return this.reject(function(clip) {
		    return clip.shouldBePlaying(time);
		  });
		},
		
		stop: function() {
		  this.each(function(clip) {
		    clip.player.stop();
		  });
		}

	});
	
	window.Player = Backbone.Model.extend({

	  defaults: {
	    state: 'stop'
	  },
	  
	  play: function() {
	    this.set({state: 'play'});
	  },
	  
	  stop: function() {
	    this.set({state: 'stop'});
	  },
	  
	  isPlaying: function() {
      return (this.get('state') == 'play');
	  },
	  
	  isStopped: function() {
	    return (!this.isPlaying());
	  }
	  
	});
	
	
	window.Master = Player.extend({
	  initialize: function() {
	    this.mediaclips = this.get('mediaclips');
      this.set({duration: this.mediaclips.masterLength()});
      this.bind("change:time", this.setTime);
	  },
		
		defaults: {
	    time: 0
		},
		
		play: function() {
		  this.set({state: 'play'});
		  this.mediaclips.playClips(this.get('time'));
		},
		
		stop: function() {
		  this.set({state: 'stop'});
		  this.mediaclips.stop();
		},
		
		setTime: function() {
		  if (this.isPlaying()) {
        this.play();
      }
      else {
        this.stop();
      }
		}
		
	});
	
	$(document).ready(function() {
		
		window.MediaClipView = Backbone.View.extend({});
		
		window.MasterView = Backbone.View.extend({});
		
	});
	
})(jQuery);