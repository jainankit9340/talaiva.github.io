

/* 1. Header
=========================================*/
$(function(){
	// Open/close menu
	$('.hamburger-menu').on('click', function() {
		$(this).toggleClass('open');
		$('nav').toggleClass('active');
	});
	$('nav a').on('click', function () {
		$('.hamburger-menu').toggleClass('open');
		$('nav').toggleClass('active');
	});
});

/* 2. Modal
=========================================*/
$(document).on('click', '.modal-data', function(e){
	e.preventDefault();
	var url = $(this).attr('href');
	var overlay = $('.overlay');
	overlay.html('');
	overlay.addClass('inprogress');

	// disable mousewheel
	$('body').off('mousewheel');

	$.ajax({
		url: url,
		success: function(data) {
			overlay.addClass('active');

			setTimeout(function () {
				overlay.html(data);

				$('.img-slider').slick({
					mobileFirst: true,
					slidesToShow: 1,
					responsive: [
						{
							breakpoint: 640,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 1,
								infinite: true,
								dots: true
							}
						},
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 3,
								slidesToScroll: 1,
								infinite: true,
								dots: true
							}
						},
						{
							breakpoint: 1600,
							settings: {
								slidesToShow: 4,
								slidesToScroll: 1,
								infinite: true,
								dots: true
							}
						}
					]
				});
				filledLabels();
				dateRange();

				$(".video").click(function() {
					$.fancybox({
						'padding'		: 0,
						'autoScale'		: false,
						'transitionIn'	: 'none',
						'transitionOut'	: 'none',
						'title'			: this.title,
						'width'			: 640,
						'height'		: 385,
						'href'			: this.href.replace(new RegExp("watch\\?v=", "i"), 'v/index.html'),
						'type'			: 'swf',
						'swf'			: {
						'wmode'				: 'transparent',
						'allowfullscreen'	: 'true'
						}
					});

					return false;
				});
				$("a[rel='group']").fancybox({
					'transitionIn'	: 'elastic',
					'transitionOut'	: 'elastic',
					'speedIn'		: 600,
					'speedOut'		: 200,
					'overlayShow'	: false,
					helpers : {
						title: {
							type: 'over'
						}
					},
				});
				setTimeout(function() {
					overlay.removeClass('inprogress');
					$('.overlay .anim').addClass('fade-in-down');
					$('.content').addClass('fade-in-up');

					$(".sidemenu").square_menu({
						flyDirection: "bottom",
						button: false,
						animationStyle: "vertical",
						closeButton: "&times;"
					});
					$(".btn-menu").click(function() {
						var btnMenuNum = $(this).index();
						$(".sidemenu").openMenu();
						$( ".sidemenu" ).tabs({
							active: btnMenuNum
						});
					});
					$( function() {
						$( ".sidemenu" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
						$( ".sidemenu li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
					} );
				}, 500);
			}, 500);

		}
	});

	$(document).on('click', '.close', function(e){
		e.preventDefault();
		overlay.removeClass('active');
		overlay.empty();

		// enable mousewheel
		$('body').on('mousewheel', onWheel);
	});

	function filledLabels() {
		var inputFields = $('.booking-form .control-label').next();
		inputFields.each(function(){
			var singleInput = $(this);
			singleInput.on('focus blur', function(event){
				checkVal(singleInput);
				console.log(event);
			});
		});
	}

	function checkVal(inputField) {
		if (inputField.val() === '') {
			if (event.type === "focus") {
				inputField.prev('.control-label').addClass('filled')
			} else if (event.type === "blur") {
				inputField.prev('.control-label').removeClass('filled')
			}
		}
	}

	function dateRange() {
		$(".daterange").daterangepicker({
			datepickerOptions : {
				numberOfMonths : 2,
				minDate: 0,
				maxDate: null
			}
		});
	}
});

/* 3. Routing
=========================================*/
var width = (window.innerWidth > 0) ? window.innerWidth : document.documentElement.clientWidth;

if(width > 922) {

	var flag = 'true';
	var currentSection = $('section').attr('data-view');

	var storage = {};

	storage.flag = flag;
	storage.target = currentSection;

	var $navLink = $('a.page-scroll[data-number='+storage.target+']');
	var menuItemNumber = $('nav a.page-scroll').length;
	$navLink.addClass('active');

	'use strict';
	var $page = $('#main'),
		$site = $('body'),
		target,
		transition = 'fade',
		prevTransition = 'moveUp', // can be moveRight, moveLeft, moveDown, moveUp
		nextTransition = 'moveDown',  // can be moveRight, moveLeft, moveDown, moveUp
		options = {
			debug: true,
			prefetch: true,
			cacheLength: 4,
			anchors: 'a.page-scroll',

			onBefore: function($anchor, $container) {
				var current = $('[data-view]').first().data('view'),
					target = $anchor.data('number');
					$anchor.addClass('active');
					current = current ? current : 0;
					target = target ? target : 0;
					if (current === target) {
						transition = 'fade';
					} else if (current < target) {
						transition = prevTransition;
					} else {
						transition = nextTransition;
					}
					storage.target = target;

			},
			onStart: {
				duration: 350, // Duration of our animation
				render: function ($container) {
					// Add your CSS animation reversing class
					$container.addClass('is-exiting');
					$page.attr('data-transition', transition);
					// Restart your animation
					smoothState.restartCSSAnimations();
				}
			},
			onReady: {
				duration: 0,
				render: function ($container, $newContent) {
					// Remove your CSS animation reversing class
					$container.removeClass('is-exiting');
					// Inject the new content
					$container.html($newContent);
					$navLink = $('a.page-scroll[data-number='+storage.target+']');
					$navLink.addClass('active');

					if ($('#map_canvas').length > 0) {
						initMap();
					}

					if ($('.testimonials').length > 0) {
						$('.testimonials-carousel').slick({
							slidesToShow: 1,
							autoplay: true,
							arrows: false,
							dots: true
						});
					}

					setTimeout(function(){
						flag = 'true';
					}, 500);
				}
			}
		},
		smoothState = $page.smoothState(options).data('smoothState');

		$($site).on('mousewheel', debounce(onWheel, 50));

		function onWheel(event) {
			if (flag === 'true') {
				flag = 'false';
				if (event.originalEvent.deltaY < 0) {//scroll Up
					if (storage.target === 0) {
						storage.target = menuItemNumber;
					}
					transition = nextTransition;
					storage.target = +storage.target-1;
				} else {//scroll Down
					if (storage.target === menuItemNumber-1) {
						storage.target = -1;
					}
					transition = prevTransition;
					storage.target = +storage.target+1;
				}

				var $navLinkNext = $('a.page-scroll[data-number='+(+storage.target)+']');

				smoothState.load($navLinkNext.attr('href'));
			} else {
				return;
			}
		}

		function debounce(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this, args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		};
}

/* 4. Map
=========================================*/
var map;
function initMap() {
	// Create an array of styles.
	var styles = [
	{
		"elementType": "geometry",
		"stylers": [{"color": "#f5f5f5"}]
	},
	{
		"elementType": "labels.icon",
		"stylers": [{"visibility": "off"}]
	},
	{
		"elementType": "labels.text.fill",
		"stylers": [
			{"color": "#616161"}]
	},
	{
		"elementType": "labels.text.stroke",
		"stylers": [{"color": "#f5f5f5"}]
	},
	{
		"featureType": "administrative.land_parcel",
		"elementType": "labels.text.fill",
		"stylers": [{"color": "#bdbdbd"}]
	},
	{
		"featureType": "poi",
		"elementType": "geometry",
		"stylers": [{"color": "#eeeeee"}]
	},
	{
		"featureType": "poi",
		"elementType": "labels.text.fill",
		"stylers": [{"color": "#757575"}]
	},
	{
		"featureType": "poi.park",
		"elementType": "geometry",
		"stylers": [{"color": "#e5e5e5"}]
	},
	{
		"featureType": "poi.park",
		"elementType": "labels.text.fill",
		"stylers": [{"color": "#9e9e9e"}]
	},
	{
		"featureType": "road",
		"elementType": "geometry",
		"stylers": [{"color": "#ffffff"}]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.text.fill",
		"stylers": [{"color": "#757575"}]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry",
		"stylers": [{"color": "#dadada"}]
	},
	{
		"featureType": "road.highway",
		"elementType": "labels.text.fill",
		"stylers": [{"color": "#616161"}]
	},
	{
		"featureType": "road.local",
		"elementType": "labels.text.fill",
		"stylers": [{"color": "#9e9e9e"}]
	},
	{
		"featureType": "transit.line",
		"elementType": "geometry",
		"stylers": [{"color": "#e5e5e5"}]
	},
	{
		"featureType": "transit.station",
		"elementType": "geometry",
		"stylers": [{"color": "#eeeeee"}]
	},
	{
		"featureType": "water",
		"elementType": "geometry",
		"stylers": [{"color": "#c9c9c9"}]
	},
	{
		"featureType": "water",
		"elementType": "labels.text.fill",
		"stylers": [{"color": "#9e9e9e"}]
	}
	];
if ($('#map_canvas').length > 0) {
	// Create a new StyledMapType object, passing it the array of styles,
	// as well as the name to be displayed on the map type control.
	var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});

	map = new google.maps.Map(document.getElementById('map_canvas'), {
		center: {lat: 40.89, lng: -73.98},
		zoom: 13,
		scrollwheel: false,
		mapTypeControl: false
	});

	// var image = 'img/point.png';
	var beachMarker = new google.maps.Marker({
		position: {lat: 40.89, lng: -73.98},
		map: map,
		// icon: image
	});

	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');
}
}