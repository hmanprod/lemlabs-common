Date.prototype.getWeek = function() {
	var date = new Date(this.getTime());
	date.setHours(0, 0, 0, 0); 
	// Thursday in current week decides the year. 
	date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7); 
	// January 4 is always in week 1. 
	var week1 = new Date(date.getFullYear(), 0, 4); 
	// Adjust to Thursday in week 1 and count number of weeks from date to week1. 
	return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7); 
};

Date.prototype.getMonday = function () {
	  var d = new Date(this.getTime());
	  var day = d.getDay(),
	      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
	  return new Date(d.setDate(diff));
};

Date.prototype.getDigitMonth = function () {
	  var d = new Date(this.getTime());
	  var month = d.getMonth();
	      if(month < 9)
	    	  return '0' + (month+1);
	  return month+1;
};

$(document).ready(function() {
		
	if($("[data-event=scroll]").length){
		var wrapper = $("[data-event=scroll]");
		$(window).on( "scroll" , function(event) {

		     var $document = $(document);
		     var $window = $(this);
		     var offset = $(".row-offset").length;
		     var url = $("[data-lazyload-action]").attr("data-lazyload-action")+'?offset='+offset

		     if( 
		    		 $document.scrollTop() >= $document.height() - $window.height() - 100 
		    		 && !wrapper.hasClass("loading-action")
		    		 && offset < parseInt(wrapper.attr('data-length'))
		     ){
		    	 wrapper.addClass("loading-action");
		    	 
		    	 ;
		    	 $(".scroll-loading").remove();
		    	 wrapper.find("tbody").append(
		    			 '<tr class="scroll-loading"><td colspan="'+ wrapper.find("thead th").length+'" align="center">'+
		    			 '<div class="laoding">'+$('.loading').html()+'</div>'+
		    			 '<td></tr>');
		    	 var options = {};
		    	 $('[data-trigger="change"]:not([disabled])').each(function() {
		 					options[$(this).attr('name')] = $(this).val();
		 		});
		    	 
		         $.ajax({
		        	 url: url,
		        	 type: 'POST',
		        	 data : { options: JSON.stringify(options) },
		        	 success: function(data){
		        		 wrapper.find("tbody").append(data);
		        	 },
		        	 complete:function(){
		        		 $(".scroll-loading").remove();
		        		 wrapper.removeClass("loading-action");
		        	 }
		         });
		         event.preventDefault();
		         return false;
		     }

		 });
	}
	
	/**
	 * Select2
	 * 
	 */
	$(".select2").select2();
	$(".select2-simple").select2({minimumResultsForSearch: "Infinity"});	
	
	/**
	 * Datepicker.
	 *
	 */
	$('.datepicker:not([readonly])').datepicker({
		showOtherMonths:true,
		autoSize: true,
		dateFormat: 'dd-mm-yy'
	});
	$('.datepicker-from').datepicker({
		showOtherMonths:true,
		autoSize: true,
		dateFormat: 'dd-mm-yy',
		onClose: function(selectedDate) {
			$('.datepicker-to').datepicker('option', 'minDate', selectedDate);
		}
	});
	
	$('.datepicker-to').datepicker({
		showOtherMonths:true,
		autoSize: true,
		dateFormat: 'dd-mm-yy',
		onClose: function(selectedDate) {
			$('.datepicker-from').datepicker('option', 'maxDate', selectedDate);
		}
	});
        
        $('.use-datepicker').datepicker({
		showOtherMonths:true,
		autoSize: true,
		dateFormat: 'dd-mm-yy'
	});
	
	$("[data-trigger=popup]").unbind('click');
	$("[data-trigger=popup]").click(function(event){
		window.open($(this).attr('href'),'','width=732, height=600, menubar=no, status=no,');
		event.preventDefault();
		return false;
	});
	
	
	/**
	 * Displays XHR alert block.
	 *
	 */
	$('[data-toggle="confirm"]').click(function() {
		var html = $(this).html();
		if($(this).attr('data-loading-text')!='undefined')
			$(this).html($(this).attr('data-loading-text'));
		$('.alert-block').remove();

		$.post($(this).attr('href'), { action: $(this).attr('href') })
		.done(function(data) {
			$('.alerts').append(data.response);
			$(this).html(html);
			$(window).scrollTop(0);
		});
		
		return false;
	});
	
	
	/**
	 * Filters process.
	 *
	 */
	var source = $('form.data-filter').attr('action');
	
	$('[data-trigger="change"]').each(function() {
		if ($(this).is('input') || $(this).is('select')) {
			$(this).change(filter);
		} else if ($(this).find(':radio').length > 0) {
			$(this).find(':radio').change(filter);
		}
	});
        
        function filter() {
		var empty	= 0;
		var options = {};
		
		$('[data-trigger="change"]:not([disabled])').each(function() {
			if ($(this).is('input') || $(this).is('select')) {
				if (!$(this).val()) {
					//empty++;
				} else {
					options[$(this).attr('name')] = $(this).val();
				}
			} else if ($(this).find(':radio').length > 0) {
				options[$(this).find(':radio:checked').attr('name')] = $(this).find(':radio:checked').val();
			}
		});
		
		if (empty < 1) {
			$('.loading').parent().show();
			
			$.post(source, { options: JSON.stringify(options) })
			.done(function(data) {
				$('[data-role="wrapper"]').html(data);
				
				$(".select2.callaback-select").select2();
				$('.dropdown-toggle').dropdown();
				preCustomFilterListener();
				
				$('[data-role="wrapper"]').off('click', '[data-toggle]');
				$('[data-role="wrapper"]').on('click', '[data-toggle]', function(e) {
					var elem	= $(this);
					var state	= elem.html();
					
					elem.attr('disabled', 'disabled');
					elem.text(elem.attr('data-loading-text'));
					
					$.post(elem.attr('href'), { options: JSON.stringify(options) })
					.always(function() {
						elem.removeAttr('disabled');
					})
					.done(function(data) {
						elem.attr('href', data.link);
						
						switch (elem.attr('data-toggle')) {
							case 'boolean-button':
								elem.html(data.html);
								break;
							case 'add':
								elem.siblings().remove();
								elem.addClass('btn-warning').attr('data-toggle', 'confirm').html(data.html);
								elem.after(data.cancel);
								
								break;
							case 'confirm':
								//elem.siblings().remove();
								//elem.removeClass('btn-warning').addClass('btn-success').attr('data-toggle', 'remove').html(data.html);
								var html = elem.html();
								if(elem.attr('data-loading-text')!='undefined')
									elem.html(elem.attr('data-loading-text'));
								$('.alert-block').remove();
								if(typeof(data.next) && data.next=='reload-filter'){
									$("select").eq(0).trigger('change');
								}else{
									$.post(elem.attr('href'), { action: elem.attr('href') })
									.done(function(data) {
										$('.alerts').append(data.response);
										elem.html(html);
										$(window).scrollTop(0);
									});
								}
								
								
								break;
							case 'remove':
								elem.removeClass('btn-success').attr('data-toggle', 'add').text(data.html);
								if (data.position == 'after') {
									elem.after(data.sibling);
								} else {
									elem.before(data.sibling);
								}
								
								break;
							case 'cancel':
								elem.prev().removeClass('btn-warning').attr('data-toggle', 'add').text(data.html).attr('href', data.link);
								if (data.position == 'after') {
									elem.prev().after(data.sibling);
								} else {
									elem.prev().before(data.sibling);
								}
								elem.remove();
								
								break;
						}
					})
					.fail(function() {
						elem.html(state);
					});
					
					e.preventDefault();
					return false;
				});
				postCustomFilterListener();
			})
			.always(function() {
				$('.loading').parent().hide();
			});
		}
	}
});


function preCustomFilterListener(){
    initModal();
}

function postCustomFilterListener(){
    
}

function initModal() {

		var overlay = document.querySelector( '.md-overlay' );

		[].slice.call( document.querySelectorAll( '.table-grid .md-trigger' ) ).forEach( function( el, i ) {

			var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) ),
				close = modal.querySelector( '.md-close' );

			function removeModal( hasPerspective ) {
				classie.remove( modal, 'md-show' );

				if( hasPerspective ) {
					classie.remove( document.documentElement, 'md-perspective' );
				}
			}

			function removeModalHandler() {
				removeModal( classie.has( el, 'md-setperspective' ) ); 
			}

			el.addEventListener( 'click', function( ev ) {
				classie.add( modal, 'md-show' );
				overlay.removeEventListener( 'click', removeModalHandler );
				overlay.addEventListener( 'click', removeModalHandler );

				if( classie.has( el, 'md-setperspective' ) ) {
					setTimeout( function() {
						classie.add( document.documentElement, 'md-perspective' );
					}, 25 );
				}
			});

			close.addEventListener( 'click', function( ev ) {
				ev.stopPropagation();
				removeModalHandler();
			});

		} );

}