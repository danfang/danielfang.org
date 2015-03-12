/*
 * Daniel Fang
 * danielfang.org -- 2015
 * Handles JS events, triggers, and page interactions
 */

var theater = new TheaterJS();
var curTagline = "";
var config = { speed: 1.0, accuracy: 1.0 };
var slower = { speed: .92, accuracy: 1.0 };
var screens = [["#top", "#bio"], ["#work"], ["#education"]];
var active = screens[0];
var taglines = ["", "work/", "education/"];

$(document).ready(function() {

	var chart = c3.generate({
	    bindto: '#chart',
	    data: {
	      	columns: [
	      		["FullStackWebPython", 0.26259943284384], ["DesktopLinux", 0.142942919636253], ["FullStackWebNodeJS", 0.110394773701236], ["DesktopOSX", 0.0698010150105798], ["FullStackWebJava", 0.0542110098153007], ["BackEndWebCloud", 0.0411369265976539], ["FullStackWebPHP", 0.0382670831167222]
	      	],
	      	type: 'donut'
	    },
	    donut : {
	    	title: "Technology Stack"
	    }
	});
	
	// initial title page resize 
	resizeTop();

	$(window).resize(function() {
		resizeTop();
	});
	
	theater.describe("tag", config, "#tagline");
	theater.describe("base", config, "#tagline-base");

	theater.write("base: home/");

	$("#title h2").delay(500).queue(function() {
		$(this).show();
		$(this).addClass("animated fadeInUp");
		$(this).dequeue();
	});

	$(".shard-container").click(function() {
		$(this).toggleClass("show");
	});

	// scrolling via menu
	$(".pagelink").each(function(index) {
		$(this).click(function() {
			theater.write(-(curTagline.length)).write("tag:" + taglines[index]);
			for (key in active) {
				$(active[key]).fadeToggle();
			}

			$("#mobile-contact").fadeToggle();
			$("#credits").fadeToggle();

			active = screens[index];

			$(".shard").removeClass("animated fadeInUp");
			$(".shard").css("opacity", 0);


			$(".education-section").removeClass("animated fadeInUp");
			$(".education-section").css("opacity", 0);

			for (key in active) {
				$(active[key]).delay(500).slideToggle();
			}

			if (active.indexOf("#work") != -1 ) {
				$(".shard").each(function(index) {
					$(this).delay(200 * (index + 5)).queue(function() {
						$(this).css("opacity", 1);
						$(this).addClass("animated fadeInUp");
						$(this).dequeue();
					});
				});	
			}

			if (active.indexOf("#education") != -1 ) {
				$(".education-section").each(function(index) {
					$(this).delay(200 * (index + 5)).queue(function() {
						$(this).css("opacity", 1);
						$(this).addClass("animated fadeInUp");
						$(this).dequeue();
					});
				});	
			}

			$("#mobile-contact").delay(500).fadeToggle();
			$("#credits").delay(500).fadeToggle();
		});
	});

	// scrolling via "see more"
	$("#seemore").click(function() {
		$('html, body').animate({
			scrollTop: $("#bio").offset().top - 80
		}, 750);
	});
});

// ensures the title section is always as large as the user's screen
function resizeTop() {
	$("#top").css("height", $(window).height() - 80);
}
