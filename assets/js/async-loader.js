/*
jQuery loader.
*/
(function() {
	const jquerySelector = document.querySelector(".jquery");
	if (!jquerySelector) return;

	const script = document.createElement("script");
	script.src = 'assets/js/jquery.min.js';
	script.type = 'text/javascript';
	script.addEventListener('load', () => {
		console.log(`jQuery ${$.fn.jquery} has been loaded successfully!`);
		jQueryScripts();
	});
	document.head.appendChild(script);
})();

/*
Vanilla JS scripts.
*/
(function() {
	// Date and Time
	const dateSelector = document.getElementById("Date");
	if (dateSelector) loadJS("dist/js/datetime.min.js", true);
	// Search
	const textareaSelector = document.querySelector(".textarea");
	if (textareaSelector) loadJS("dist/js/search.min.js", true);
	// Stars
	const starsSelector = document.querySelector(".stars");
	if (starsSelector) loadJS("dist/js/stars.min.js", true);
})();

/*
jQuery dependent scripts.
*/
function jQueryScripts() {
	// slick carousel
	const slickSelector = document.querySelector(".slick-start");
	if (slickSelector) {
		loadJS("assets/js/slick.min.js", false);
		loadJS("dist/js/slick-config.min.js", true);
		//loadCSS("assets/css/slick.css");
		//loadCSS("assets/css/slick-theme.css");
	}
	// jQuery Ripples plugin
	const ripplesSelector = document.querySelector(".ripples");
	if (ripplesSelector) {
		loadJS("assets/js/jquery.ripples.min.js", false);
		loadJS("dist/js/jquery.ripples-config.min.js", true);
	}
}

/*
JS async loader.
*/
function loadJS(FILE_URL, async = true, footer = true, defer) {
	const scriptEle = document.createElement("script");
	scriptEle.src = FILE_URL;
	scriptEle.type = "text/javascript";

	if (defer) scriptEle.defer = true;
	if (async) scriptEle.async = true;

	footer ? document.body.appendChild(scriptEle) : document.head.appendChild(scriptEle);

	// Success event
	scriptEle.addEventListener("load", () => {
		console.log("JS file loaded", FILE_URL);
	});
	// Error event
	scriptEle.addEventListener("error", (ev) => {
		console.log("Error loading JS file", ev);
	});
}

/*
CSS loader.
*/
function loadCSS(FILE_URL, crossorigin = false) {
	const styleEle = document.createElement("link");
	styleEle.rel = "stylesheet";
	styleEle.type = "text/css";
	styleEle.href = FILE_URL;

	if (crossorigin) styleEle.crossOrigin = "anonymous";

	document.head.appendChild(styleEle);

	// Success event
	styleEle.addEventListener("load", () => {
		console.log("CSS file loaded", FILE_URL);
	});
	// Error event
	styleEle.addEventListener("error", (ev) => {
		console.log("Error loading CSS file", ev);
	});
}
