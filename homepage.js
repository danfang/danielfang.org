/*
 * Daniel Fang
 * danielfang.org -- 2015
 * Handles JS events, triggers, and page interactions
 */

var theater = new TheaterJS();

$(document).ready(function() {

	var curTagline = "";

	var config = { speed: 1.0, accuracy: 1.0 };
	var slower = { speed: .92, accuracy: 1.0 };
	theater.describe("tag", config, "#tagline");
	theater.describe("base", config, "#tagline-base");

	theater.describe("ls", slower, "#ls");
	theater.describe("name", slower, "#name");

	theater.write("base: home/");
	// initial title page resize 
	resizeTop();

	$(window).resize(function() {
		resizeTop();
	});

	var screens = [["#top", "#bio"], ["#work"], ["#education"]];
	var active = screens[0];

	theater.write("ls:ls");
	theater.write("name:\"Daniel Fang\"");

	$("#title h2").delay(2500).fadeToggle();

	$(".shard-container").click(function() {
		$(this).toggleClass("show");
	});

	// scrolling triggers
	$(window).scroll(function() {
		// making bio appear
		$("#bio p").each(function() {
			if ($(window).scrollTop() + $(window).height() - 150 > $(this).offset().top) {
				$(this).addClass("onload");
			}
		});
	});

	taglines = ["", "work/", "education/"];

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

			for (key in active) {
				$(active[key]).delay(500).slideToggle();
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