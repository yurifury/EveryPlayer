(function($) {
	
	window.MediaClip = Backbone.Model.extend({
		
		intialize: function() {
			this.player = this.options.player;
		},
		
		relativeEnd: function() {
			return this.get('in') + this.get('duration');
		}
		
	});
	
	
	window.MediaClips = Backbone.Collection.extend({
		
		model: MediaClip,
		
		masterLength: function() {
			var last_clip = this.max(function(clip) {
				return clip.relativeEnd();
			});
			return last_clip.relativeEnd();
		}

	});
	
	window.Master = Backbone.Model.extend({
		
		initialize: function() {
			this.set({duration: this.get('mediaclips').masterLength()});
		}
		
	});
	
	window.Player = Backbone.Model.extend({});
	
	$(document).ready(function() {
		
		window.MediaClipView = Backbone.View.extend({
			
			initialize: function() {
				this.player = this.options.player;
			}
			
		});
		
	});
	
})(jQuery);