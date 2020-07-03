/*------------------------- For vertical tabs --------------------------*/
$(masterStructure).on("Framework:pageLoaded#m0-2", function(){	
	
	var $accordion = $(".accordion.vertical_tabs");
	$accordion.equalHeightColumns('summary');
	$accordion.setAccordionMinHeight();	
	var handleInterval;
	
	$('.accordion.vertical_tabs details').on('click',function(){
		if($(this).hasClass('off')){			
			//$tgl_panel = $(this).find('.tgl-panel');			
			$tgl_panel = $(this).find('.tgl-panel');		
			$tgl_content = $tgl_panel.find('.tgl-content');		

			var handleInterval = setInterval(function(){				
				//$tgl_panel.setAccordionHeight(handleInterval,$accordion);
				$tgl_content.setAccordionHeight(handleInterval,$tgl_panel);
				$tgl_content.setAccordionHeight(handleInterval,$accordion);
			},20);
		}		
	});
});
$(window).resize(function(){
	var $accordion = $(".accordion.vertical_tabs");
	$accordion.equalHeightColumns('summary');
	$accordion.setAccordionMinHeight();
	
	$detailsOn = $accordion.find('details:not(.off)');
	if($detailsOn.length){
		var handleInterval = setInterval(function(){		
			$tgl_panelOn = $detailsOn.find('.tgl-panel');
			$tgl_content = $tgl_panelOn.find('.tgl-content');	
			$tgl_panelOn.setAccordionHeight(handleInterval,$accordion);			
		},100);
	}	
});

/*------------------------- For special tabs --------------------------*/

// wait until $(this) object is visible  - receives handle to clear setInterval if needed
// then check if all panels are open set equal columns
(function($){
	$.fn.checkVisible = function(handle,$accordion){
		
		// check if tgl_panel is visible to set height on all panels
		if($(this).is(':visible')) {
			if(handle != null){clearInterval(handle);}		
			
			var atLeastTwoVisible = true;
			$accordion.find('details').each(function(index){				
				if(!$(this).is('[open]')) {
					atLeastTwoVisible |= true;
				}				
			})			
			if(atLeastTwoVisible) $accordion.equalHeightColumns('.tgl-panel');			
		}
	}
})(jQuery);

$(masterStructure).on("Framework:pageLoaded#m0-2", function(){
	var $accordion = $(".accordion.horizontal");
	$accordion.equalHeightColumns('summary');	
	
	var handleInterval;	
	$('.accordion.horizontal details').on('click',function(event){
		$tgl_panel = $(this).first('.tgl-panel');
		// wait for details to open and adjust panel height if all opened
		var handleInterval = setInterval(function(){
				$tgl_panel.checkVisible(handleInterval,$accordion);
		},100);		
	});
	
});

$(window).resize(function(){
	var $accordion = $(".accordion.horizontal");
	$accordion.equalHeightColumns('summary');	
	
	$('.tgl-panel').first().checkVisible(null,$accordion);
});