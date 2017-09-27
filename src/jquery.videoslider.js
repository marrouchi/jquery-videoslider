/*
 * videoslider
 * https://github.com/medmar/jquery-videoslider
 *
 * Copyright (c) 2017 Mohamed marrouchi
 * Licensed under the MIT license.
 */

(function($) {

  // Static method.
  $.videoslider = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.videoslider.options, options);

    this.position = 0; // current position
    this.isPlaying = false; // scroll direction
    this.scrollDirection = 'forward';
    this.selector = $(options.selector);
    this.intervals = $(".videoslider-slide", this.selector)
      .map(function(){return $(this).data('vstime')})
      .toArray();

    this.video = $("video", this.selector).get(0); // get rid of jquery to handle video controls

    // Define rewind() function
    this.rewind = function () {
      var requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
      function (fn) {window.setTimeout(fn, 15)};

      var videoSlider = this;

      var step = function(){
         if(videoSlider.video.currentTime > 0 && videoSlider.isPlaying){
             videoSlider.video.currentTime += -.05;
             requestAnimationFrame(step);
         }
      };
      step();
    };

    this.slideHandle = function(event){
      // Do not allow scroll when the video is playing
      if(!videoSlider.isPlaying){
        videoSlider.isPlaying = true; // Lock controls
        if(videoSlider.scrollDirection === 'forward'
          && videoSlider.position < videoSlider.intervals.length - 1){
          // Play forward
          $('.videoslider-slide:eq('+videoSlider.position+')', this.selector).fadeOut();
          videoSlider.position++;
          videoSlider.video.play();
          event.preventDefault();
        } else if(options.enableRewind &&
          videoSlider.scrollDirection === 'backward'
          && videoSlider.position > 0) {
          // Play backwards
          $('.videoslider-slide:eq('+videoSlider.position+')', this.selector).fadeOut();
          videoSlider.position--;
          videoSlider.rewind();
          event.preventDefault();
        } else {
          videoSlider.isPlaying = false;
        }
      }
    }

    var videoSlider = this;

    // Add first & last positions
    $(videoSlider.video).on('loadedmetadata', function() {
      videoSlider.intervals[videoSlider.intervals.indexOf('duration')] = this.duration;
    });

    // Set playback rate
    videoSlider.video.playbackRate = options.playbackRate;

    // Show last slide when ended
    $(videoSlider.video).on('ended', function(){
      videoSlider.isPlaying = false;
    });

    // Pause video when interval limit is reached
    $(videoSlider.video).on('timeupdate', function(){
      if((videoSlider.scrollDirection === 'forward'
        && this.currentTime >= videoSlider.intervals[videoSlider.position])
        || (videoSlider.scrollDirection === 'backward'
        && this.currentTime <= videoSlider.intervals[videoSlider.position]) ){
          this.pause();
          videoSlider.isPlaying = false;
          $('.videoslider-slide:eq('+videoSlider.position+')', videoSlider.selector).fadeIn();
      }
    });

    // Handle Key Up/Down
    $(document).keydown(function(event) {
      switch(event.which) {
        case 38: // up
          videoSlider.scrollDirection = 'backward';
          break;
        case 40: // down
          videoSlider.scrollDirection = 'forward';
          break;
        default:
          return; // exit this handler for other keys
      }
      videoSlider.slideHandle(event);
    });

    // Handle scroll
    $(videoSlider.selector).on('mousewheel', function(event) {
      videoSlider.scrollDirection = (event.originalEvent.deltaY > 0) ? 'forward' : 'backward';
      videoSlider.slideHandle(event);
    });

    return;
  };

  // Static method default options.
  $.videoslider.options = {
    playbackRate: 1,
    enableRewind: true,
    selector: '#videoslider'
  };

}(jQuery));
