/**
 * Theme functions file
 *
*/

// Mobile Menu.
jQuery(document).ready(function(){
    	jQuery('#mobile-menu-wrap').hide();
		jQuery('a#mobile-menu-toggle').click(function () {
		jQuery('#mobile-menu-wrap').slideToggle('600');
    });
});

jQuery(document).ready(function(){
		jQuery('a#mobile-menu-close').click(function () {
		jQuery('#mobile-menu-wrap').slideToggle('600');
    });
});

// Archive Header Area Menu.
jQuery(document).ready(function(){
    	jQuery('.archive-menu-content').hide();
		jQuery('a.archive-menu-toggle').click(function () {
		jQuery('.archive-menu-content').slideToggle('600');
		jQuery('a.archive-menu-toggle').toggleClass('archive-open');
    });
});

jQuery(document).ready(function(){
		jQuery('a.archive-menu-close').click(function () {
		jQuery('.archive-menu-content').slideToggle('600');
		jQuery('a.archive-menu-toggle').removeClass('archive-open');
    });
});

// Initialize Featured Content slider.
jQuery(window).load(function() {
    jQuery('.flexslider').flexslider({
    animation: "fade", //String: Select your animation type, "fade" or "slide"
    slideshow: true, //Boolean: Animate slider automatically
    startAt: 0, //Integer: The slide that the slider should start on. Array notation (0 = first slide)
    prevText: "<span>Previous</span>", //String: Set the text for the "previous" directionNav item
	  nextText: "<span>Next</span>",
    initDelay: 1000,
    touch: true //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
  });
});

// Scalable Videos (more info see: fitvidsjs.com).
jQuery(document).ready(function(){
	jQuery('#primary').fitVids();
});

// Header Search (Desktop only).
if (document.documentElement.clientWidth > 1200) {
jQuery(document).ready(function(){
		jQuery("a#search-toggle").click().toggle(function() {
		jQuery('#searchform').animate({
			width: 'show',
			opacity: 'show'
		}, 'fast');
		jQuery('a#search-toggle').addClass('btn-open');
	}, function() {
		jQuery('#searchform').animate({
			width: 'hide',
			opacity: 'hide'
		}, 'fast');
		jQuery('a#search-toggle').removeClass('btn-open');
    });
});
}
