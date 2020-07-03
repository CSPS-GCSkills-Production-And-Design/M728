var oldText;
if($("html").attr("lang") === "fr"){
	var newText = "<b>Répondez à la question, puis cliquez sur le bouton « Valider l'activité » pour continuer.</b>";
}
else if ($("html").attr("lang") === "en"){
	var newText = "<b>Select the response that best answers the question and then click on the “Submit exam” button to proceed.</b>";
}

//var qsObjParams = {"cheatMode":true,"debugMode":true}
function fQsEventDispatcher(evt, params) {
	if (evt === "activity_completed") {
		// passed exam
		if (params.activity_successfully_completed) {
			//console.log("yes");
			scorm.complete();
			window.unlockPage('m8');
			if ($('.qs-item-failed').length > 0) {
				$('.qs-final-positive-feedback .recap').show();
			}
		}
		// failed exam
		else {
			//console.log("nope");
			$('.qs-final-negative-feedback .recap').show();
			//$('.qs-post-feedback').remove(); // remove feedbacks/answers               
		}
		
		if ($('.qs-item-failed').length > 0) {
			$('.recap').show();
			
			$(".qs-elearning-activity .qs-recap-template .qs-recap-item").each(function(){
				var num = $(this).attr("id").replace( /^\D+/g, '');
				var element = "<h4 class=\"recapQuestionNum\">Question " + num + "</h4>";
				$(this).prepend(element);
			});
		}
		window.unlockPage('m8');
	}
	else if(evt === "question_navigation"){
		setTimeout(function(){
			$(".qs-question[aria-hidden='false']")[0].focus();
		}, qsObj.settings.animBaseDuration+50);
		
		if(qsObj.qsComputeProgression(0,"qat") === qsObj.questionsArr.length - 1 && params.direction === 1){
			oldText = $(".nextQuestion").html();
			$(".nextQuestion").html(newText);
		}
		else{
			$(".nextQuestion").html(oldText);
		}
	}
}

/*$(".qs-finallinkto-unanswered-placeholder").on("DOMSubtreeModified", function(){
	console.log("test2");
	if($(".qs-finallinkto-unanswered-placeholder div ul li a").length){
		$(".qs-finallinkto-unanswered-placeholder").off();
		$(".qs-finallinkto-unanswered-placeholder div ul li a").click(function(){
			console.log("test");
		});
	}
});*/