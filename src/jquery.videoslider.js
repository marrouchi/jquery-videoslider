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
    this.scrollDirection = 'forward';
    this.intervals = $("#videoslider .videoslider-slide")
      .map(function(){return $(this).data('vstime')})
      .toArray();

    this.video = $("#videoslider video").get(0); // get rid of jquery to handle video controls

    // Define play() function
    this.play = function (rewind){
      rewind = typeof rewind === 'undefined' ? false : rewind;

      var step = options.stepRate * ( rewind ? -1 : 1);
      if ((rewind && this.video.currentTime > 0) 
        || (!rewind && this.video.currentTime < this.video.duration)) {
        this.video.currentTime += step;
      }
    };

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
      console.log(videoSlider.scrollDirection, this.currentTime, '('+videoSlider.position+')');
      if (videoSlider.scrollDirection === 'forward') {
        // Move forward
        if (this.currentTime > (videoSlider.intervals[videoSlider.position] + options.slideTime)) {
          $('#videoslider .videoslider-slide:eq('+videoSlider.position+')').fadeOut('slow');
          videoSlider.position++;
        } else if (this.currentTime >= videoSlider.intervals[videoSlider.position]) {
          $('#videoslider .videoslider-slide:eq('+videoSlider.position+')').fadeIn('slow');  
        } 
      } else if (videoSlider.scrollDirection === 'backward') {
        // Move backwards
        if (this.currentTime < videoSlider.intervals[videoSlider.position]) {
          $('#videoslider .videoslider-slide:eq('+videoSlider.position+')').fadeOut('slow');
          videoSlider.position--;
        } else if (this.currentTime <= (videoSlider.intervals[videoSlider.position] + options.slideTime)) {
          $('#videoslider .videoslider-slide:eq('+videoSlider.position+')').fadeIn('slow');
        }
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
        videoSlider.play(videoSlider.scrollDirection === 'backward');
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });

    // Handle scroll
    $('#videoslider').on('mousewheel', function(event) {
      videoSlider.scrollDirection = (event.originalEvent.deltaY > 0) ? 'forward' : 'backward';
      videoSlider.play(videoSlider.scrollDirection === 'backward');
      event.preventDefault();
    });

    return;
  };
  
  // Static method default options.
  $.videoslider.options = {
    playbackRate: 1,
    stepRate: .2,
    slideTime: 1
  };

}(jQuery));
