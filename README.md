# Videoslider

Play/Pause video on scroll while displaying text slides.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/medmar/jquery-videoslider/master/dist/videoslider.min.js
[max]: https://raw.github.com/medmar/jquery-videoslider/master/dist/videoslider.js

In your web page:

```html
<div id="videoslider">
  <video class="videoslider-video">
    <source src="http://url-leading-to.your/video-file.mp4" type="video/mp4">
    Your browser does not support HTML5 video.
  </video>
  <div class="videoslider-slides">
    <div class="videoslider-slide" data-vstime="0">
      Slide #1 display initially
    </div>
    <div class="videoslider-slide" data-vstime="10">
      Slide #2 after 10 seconds
    </div>
    <div class="videoslider-slide" data-vstime="duration">
      Slide #3 displayed at the end of the video
    </div>
</div>
<script>
  $.videoslider({
    playbackRate: 5 // Play speed : default is 1
  });
</script>
```

## Test
!! Tests has not been implemented yet.

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
