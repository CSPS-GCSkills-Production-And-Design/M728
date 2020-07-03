//DO NOT MODIFY ↓
define([
    'jquery',
    'modules/objSub/objSub-utils'
], function($, ObjSubUtils) {
//DO NOT MODIFY ↑

	function initialize() {
		setEvents();
	}

	function setEvents() {
		$(masterStructure)
			.on("Framework:systemReady", function() {
				getExams();
				systemReady()
			})
			.on("Framework:pageLoaded", function() {
				pageLoaded();
			});
	}
	
	/* is called only once, when the Course has loaded*/
	function systemReady() {
		//console.log("Interactions:systemReady");
		
		/*$("div.top-menu.container").off("click", ".quit");
		var lang = $("html").attr("lang");
		$(".quit").attr("href", "content/tools/quit_" + lang + ".html").attr("data-effect", "mfp-zoom-in").addClass("wb-lbx").attr("id", "quitButton");
		wb.add('.wb-lbx');*/
		
		/*$("*").focus(function(){
			console.log($(this));
		});*/
	}

	/* is called on every page load, great for adding custom code to all pages*/
	function pageLoaded() {
		
		console.log("Interactions:pageLoaded");
		var currentModule = masterStructure.currentSub.getTop().sPosition;
		if (currentModule == 'm0'){
			if($("html").attr("lang") === "en"){
				currentModule = 'Home Page';
			}
			else if($("html").attr("lang") === "fr"){
				currentModule = "Page d'accueil";
			}
		}
		else if(currentModule == 'm7'){
			if($("html").attr("lang") === "en"){
				currentModule = 'Exam';
			}
			else if($("html").attr("lang") === "fr"){
				currentModule = 'Examen';
			}
		} 
		else if(currentModule == 'm8') currentModule = 'Conclusion';
		else {
			if($("html").attr("lang") === "en"){
				currentModule = 'Video '+ currentModule.substr(currentModule.length-1);		
			}
			else if($("html").attr("lang") === "fr"){
				currentModule = 'Vidéo '+ currentModule.substr(currentModule.length-1);		
			}
		}
		$('#current_module').html(currentModule);	
	}



	////////////////////////
	// Accordion functions//
	///////////////////////
	/* Function for equal height columns (wet wb.eqht does not seem to work so.)*/
	(function($){
		$.fn.equalHeightColumns = function(childClass){
			var max=0;			
			
			if(childClass == undefined){

				$(this).children().each(function(){			
					$(this).outerHeight('auto');
					if($(this).outerHeight()>max) max = $(this).outerHeight();
				});
				$(this).children().each(function(){
					$(this).outerHeight(max);
				});
			}
			else{
				$(this).find(childClass).each(function(){
					$(this).css('height','auto');
					if($(this).outerHeight()>max) max = $(this).outerHeight();
				});
				$(this).find(childClass).each(function(){
					$(this).outerHeight(max);
				});
			}
			
		}
	})(jQuery);
	
	// Set a minimum Height to tgl-panels to push down content
	(function($){
		$.fn.setAccordionMinHeight = function(){
			$accordion = $(this);
			$accordion.css('height','auto');
			$accordion.find('.tgl-panel').each(function(){	
				if($accordion.hasClass('vertical_tabs'))					
					$(this).css('min-height',$accordion.outerHeight()+32);	

				else
					$(this).css('min-height',$accordion.outerHeight());	
			});
		}
	})(jQuery);
	// Set a minimum Height to accordion based on tgl-panels height  when its visible to push down content
	(function($){
		$.fn.setAccordionHeight = function(handle,$accordion){
			// check if tgl_panel is visible to set height on accordion
			if($(this).is(':visible')) {			
				clearInterval(handle);	
				$accordion.css('height','auto');
				
				if($(this).outerHeight() >= $accordion.outerHeight()){														
					$accordion.css('height',$(this).outerHeight());								
				}
				else if($accordion.hasClass('accordion')){					
					$accordion.css('height',$accordion.outerHeight()+32);
				}
			}
		}
	})(jQuery);

	// wait until $(this) object is visible  - receives handle to clear setInterval if needed
	// then check if all panels are open set equal columns
	(function($){
		$.fn.checkVisible = function(handle,$accordion){

			// check if tgl_panel is visible to set height on all panels
			if($(this).is(':visible')) {
				if(handle != null){clearInterval(handle);}		

				var allVisible = true;
				$accordion.find('details').each(function(index){				
					if(!$(this).is('[open]')) {
						allVisible &= false;
					}				
				})			
				if( allVisible)	$accordion.equalHeightColumns('.tgl-panel');			
			}
		}
	})(jQuery);
	

	//////////////////////////
	// module functions /////
	/////////////////////////
	//mark module as complete	
	function moduleComplete() {
		ObjSubUtils.findSub([masterStructure.currentNav[0]]).moduleStatus = 'completed';
		var allGood = 0;
		var nbMods = 0;
		for (var modLoop = 0; modLoop < masterStructure.subs.length; modLoop++) {
			if (!masterStructure.subs[modLoop].isPage) {
				nbMods++;
				if (masterStructure.subs[modLoop].moduleStatus == 'completed') {
					allGood++;
				}
			}
		}
		updateExamList();
		if (allGood == nbMods) {
			//course complete
			//console.log("course is Complete")

			scorm.complete();
			//course completed text
			var doneHeader = (lang == "en") ? "Congratulations" : "Félicitations";
			var congratzHtml = (lang == "en") ? "You have successfully completed the course Introduction to Organization and Classification." : "Vous avez complétés avec succès le cours d’Introduction à l’organisation et la classification.";

			$(".qs-feedback-final").append("<section class='course-complete'><h2>" + doneHeader + "</h2><p>" + congratzHtml + "</p></section>");
		}
	}

	//CSPS-KR: add to global namespace since it is used in html pages
	window.moduleComplete = moduleComplete;

	function getExams() {
		var gettingData = trackingObj.getData("examList");
		//gettingData="m2-3,m3-3";
		if (typeof gettingData === "undefined" || gettingData == "") {
			//clear table, nothing entered
			updateExamList();
		} else {
			console.log("loading trackingObj for Exams");
			//get the array from trackingObj
			var examList = gettingData.split(",");
			//update the list

			updateExamList(examList);
		}
	}

	function updateExamList(update) {
		var examList = [];

		//check memory and refresh system
		if (typeof update != "undefined") {
			for (var updateList = 0; updateList < update.length; updateList++) {

				ObjSubUtils.findSub(update[updateList].slice(1)).moduleStatus = "completed";
			}
		}
		//check system and refresh memory
		for (var subLoop = 0; subLoop < masterStructure.subs.length; subLoop++) {
			if (!masterStructure.subs[subLoop].isPage) {
				if (masterStructure.subs[subLoop].moduleStatus == "completed") {
					examList[examList.length] = masterStructure.subs[subLoop].sPosition;
				}
			}
		}

		trackingObj.saveData("examList", examList.toString());
		trackingObj.syncData();

		return examList;
	}


	initialize();
	
});