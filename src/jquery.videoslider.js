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
    this.intervals = $("#videoslider .videoslider-slide")
      .map(function(){return $(this).data('vstime')})
      .toArray();

    this.video = $("#videoslider video").get(0); // get rid of jquery to handle video controls

    // Define rewind() function
    this.rewind = function (){
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
      //$('#videoslider .videoslider-slide:last').fadeIn();
    });

    // Pause video when interval limit is reached
    $(videoSlider.video).on('timeupdate', function(){
      if((videoSlider.scrollDirection === 'forward' && this.currentTime >= videoSlider.intervals[videoSlider.position])
        || (videoSlider.scrollDirection === 'backward' && this.currentTime <= videoSlider.intervals[videoSlider.position]) ){
          this.pause();
          videoSlider.isPlaying = false;
          $('#videoslider .videoslider-slide:eq('+videoSlider.position+')').fadeIn();
      }
    });

    // Handle scroll
    $('#videoslider').on('mousewheel', function(event) {
      // Do not allow scroll when the video is playing
      if(!videoSlider.isPlaying){
        videoSlider.isPlaying = true; // Lock scroll
        videoSlider.scrollDirection = (event.originalEvent.deltaY > 0) ? 'forward' : 'backward';
        if(videoSlider.scrollDirection === 'forward' && videoSlider.position < videoSlider.intervals.length - 1){
          $('#videoslider .videoslider-slide:eq('+videoSlider.position+')').fadeOut();
          videoSlider.position++;
          videoSlider.video.play();
        } else if(videoSlider.scrollDirection === 'backward' && videoSlider.position > 0) {
          $('#videoslider .videoslider-slide:eq('+videoSlider.position+')').fadeOut();
          videoSlider.position--;
          videoSlider.rewind();
        } else {
          videoSlider.isPlaying = false;
        }
      }
      event.preventDefault();
    });

    return;
  };
  
  // Static method default options.
  $.videoslider.options = {
    playbackRate: 1,
  };

}(jQuery));
