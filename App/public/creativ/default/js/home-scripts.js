(function($) {
	"use strict";
 
 // Page Preloader
    $(window).load(function() {
        $(".preloader_1").delay(300).fadeOut();
        $("#loader").delay(600).fadeOut("slow");
    });
	
// Parallax
	$.stellar({
		horizontalScrolling: false,
		verticalOffset: 100
	});
	
// Menu Hover 
	$('.dropdown').on('show.bs.dropdown', function(e){
		var $dropdown = $(this).find('.dropdown-menu');
		var orig_margin_top = parseInt($dropdown.css('margin-top'));
		$dropdown.css({'margin-top': (orig_margin_top + 30) + 'px', opacity: 0}).animate({'margin-top': orig_margin_top + 'px', opacity: 1}, 420, function(){
		$(this).css({'margin-top':''});
		});
	});
	
// Dropdown Menu 
	$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
		event.preventDefault(); 
		event.stopPropagation(); 
		$(this).parent().siblings().removeClass('open');
		$(this).parent().toggleClass('open');
	});
	
// Tooltip 
	$('[data-rel="tooltip"]').tooltip();
	
// WOW Scroll Spy
	var wow = new WOW({
		mobile: false
	});
	wow.init();	
	
// Fun Facts
	function count($this){
		var current = parseInt($this.html(), 10);
		current = current + 1; /* Where 50 is increment */
		$this.html(++current);
			if(current > $this.data('count')){
				$this.html($this.data('count'));
			} else {    
			setTimeout(function(){count($this)}, 50);
		}
		}        
		$(".stat-count").each(function() {
		$(this).data('count', parseInt($(this).html(), 10));
		$(this).html('0');
		count($(this));
	});
	
// Accordion Toggle Items
	var iconOpen = 'fa fa-minus',
		iconClose = 'fa fa-plus';
		$(document).on('show.bs.collapse hide.bs.collapse', '.accordion', function (e) {
			var $target = $(e.target)
			$target.siblings('.accordion-heading')
			.find('em').toggleClass(iconOpen + ' ' + iconClose);
				if(e.type == 'show')
					$target.prev('.accordion-heading').find('.accordion-toggle').addClass('active');
				if(e.type == 'hide')
				$(this).find('.accordion-toggle').not($target).removeClass('active');
			});	
  
// Rotate Text
	$(".rotate").textrotator({
		animation: "fade",
		speed: 1000
	});
	
// Left Side Menu
	$('[data-toggle=offcanvas]').click(function() {
		$('.row-offcanvas').toggleClass('active');
	});  })(jQuery);