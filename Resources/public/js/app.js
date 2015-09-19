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

$(function() {
	/**
	 * 	ColorPicker
	 */
		//$('.pickerColor').colorpicker();
		/*$('.pickerColor').simplecolorpicker({
			  picker: true
		});*/

	/**
	 * DeleteDatabase
	 * 
	 */
	$("#deleteDatabase").click(function(){
		$.post($(this).attr('href'))
		.done(function(data) {
			$('.alerts').append(data.response);
			$(window).scrollTop(0);
		});
		return false;
	});
	
	/**
	 * Select2
	 * 
	 */
	$(".select2").select2();
	$(".select2-simple").select2({minimumResultsForSearch: "Infinity"});
	
	/**
	 * Hide/show sidebar.
	 *
	 */
	$('.fullview').click(function(){
	    $("body").toggleClass("clean");
	    $('#sidebar').toggleClass("hide-sidebar mobile-sidebar");
	    $('#content').toggleClass("full-content");
	});
	
	
	/**
	 * Datepicker.
	 *
	 */
	/*if (!Modernizr.inputtypes.date) {
		$('.datepicker').datepicker({
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
	}*/
	
//	$('.timepicker').timepicker({'timeFormat': 'H:i'});
	$('.datepicker:not([readonly]), .use-datepicker:not([readonly]').datepicker({
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
	
	$("[data-trigger=popup]").unbind('click');
	$("[data-trigger=popup]").click(function(event){
		window.open($(this).attr('href'),'','width=732, height=600, menubar=no, status=no,');
		event.preventDefault();
		return false;
	});
	
	
	/**
	 * Easy tabs.
	 *
	 */
	$('.sidebar-tabs').easytabs({
		animationSpeed: 150,
		collapsible: false,
		tabActiveClass: "active"
	});

	$('.actions').easytabs({
		animationSpeed: 300,
		collapsible: false,
		tabActiveClass: "current"
	});
	
	
	/**
	 * Collapsible plugin for main nav.
	 *
	 */
	$('.expand').collapsible({
		defaultOpen: 'current,third',
		cookieName: 'navAct',
		cssOpen: 'subOpened',
		cssClose: 'subClosed',
		speed: 200
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
	
	customFilterListener();
	
	fixHeight(".canevas-commentaire");
	
	
	
	/**
	 * Expand.
	 *
	 */
	var expand 	= $('[data-expand="more"]').find('input:eq(20)').nextAll();
	var more 	= $('<a>').attr('href', '#')
					.addClass('more-link')
					.append('[+] Lire la suite')
					.click(function(event) {
		if ($(this).hasClass('open')) {
			expand.hide();
			$(this).text('[+] Lire la suite');
		} else {
			expand.show();
			$(this).text('[-] Lire moins');
		}
		
		$(this).toggleClass('open');
		event.preventDefault();
	});
	
	expand.parent().append(more);
	expand.hide();
	
	
	/**
	 * Trigger close alert.
	 *
	 */
	$('.alert').alert();
	
	
	/**
	 * Filters process.
	 *
	 */
	var source = $('[data-filter]').attr('data-filter');
	
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
			$('.loading').show();
			
			$.post(source, { options: JSON.stringify(options) })
			.done(function(data) {
				$('[data-role="wrapper"]').html(data);
				
				$(".select2.callaback-select").select2();
				$('.dropdown-toggle').dropdown();
				customFilterListener();
				
				fixHeight(".canevas-commentaire");
				
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
				$('.loading').hide();
			});
		}
	}
	
	
	/**
	 * Autocomplete username.
	 *
	 */
	$('[data-role="wrapper"]').on('change', 'input[type="checkbox"][name^="eleve"]', function() {		
		if ($('[data-role="wrapper"] input[type="checkbox"][name^="eleve"]:checked').length == $('[data-role="wrapper"] input[type="checkbox"][name^="eleve"]').length) {
			$('input[type="checkbox"][data-select-prefix="select"]').prop('checked', true);
		} else {
			$('input[type="checkbox"][data-select-prefix="select"]').prop('checked', false);
		}
	});
	
	$('[data-role="wrapper"]').on('change', 'input[type="checkbox"][data-select-prefix="select"]', function() {
		if ($(this).is(':checked')) {
			$('[data-role="wrapper"]').find('input[type="checkbox"][name^="eleve"]').prop('checked', true);
		} else {
			$('[data-role="wrapper"]').find('input[type="checkbox"][name^="eleve"]').prop('checked', false);
		}
	});
	
	$('.add-user').find('[data-handler="change"]').each(function() {
		$(this).change(autocomplete);
	});
	
	function autocomplete() {
		var empty	= 0;
		var options = [];

		$('.add-user').find('[data-handler="change"]').each(function() {
			if (!$(this).val()) {
				empty++;
			} else {
				options.push($(this).val());
			}
		});
		
		if (empty < 1) {
			$.post($('.add-user').attr('data-change-source'), { options: JSON.stringify(options) })
			.done(function(data) {
				$('.add-user').find('[data-change="autocomplete"]').val(data.value);
			});
		}
	}
});

function canevasToggle(id){
	$(".canevas-ajax-form").hide();
	$(".canevas-content").show();
	$("#canevas-content-"+id).toggle();
	$("#canevas-ajax-form-"+id).toggle();
}
function canevasSave(id, datatype){
	var form = $("#canevas-ajax-form-"+id);
	var process = true;
	var next_url = form.attr('action');
	if(form.hasClass('check-status')){
		if(form.find("select[name=status]").val()=='0'){
			process = false;
			next_url = form.attr('data-action-remove');
		}
	}
	
	var data = form.serialize();
	if(typeof(datatype)!='undefined' && datatype=='json'){
		options = {};
		form.find('input, select').each(function(){
			options [$(this).attr('name')]=$(this).val();
		});
		data = {options:JSON.stringify(options)};
	}
	
	form.parent().html('<img src="/img/elements/loaders/6s.gif" alt="Chargement...">');
	if(form.find('select').val()!=null && process){
		$.ajax({
			url : next_url,
			data : data,
			type : 'POST',
			success: function(response){
				if(response.status == "true"){
					$("select[name=classe]").val(form.find('.input-hidden-classe').val()).trigger("change");
				}else if(response.status == "done")
					window.location.reload();
			}
		});
	}else{
		form.find('.select2-choices').css('border-color','red');
		if(process==false){
			$.post(next_url,data).done(function(response){
				if(response.status == "done")
					window.location.reload();
			});
			$(".canevas-ajax-form").hide();
			$(".canevas-content").show();
		}
	}
}

function canevasDelete(id){
	var form = $("#canevas-ajax-form-"+id);
		$.ajax({
			url : form.attr('action')+'?action=delete',
			data : form.serialize(),
			type : 'POST',
			success: function(data){
				$('.alerts').append(data.response);
				$(window).scrollTop(0);
			}
		});
}

function fixHeight(selector){
	var items = $(selector);
	var maxHeight = 0;
	items.each(function(){
		if($(this).height() > maxHeight)
			maxHeight = $(this).height();
	});
	
	items.height(maxHeight);
}

function customFilterListener(){
	$("[data-trigger=popup]").unbind('click');
	$("[data-trigger=popup]").click(function(event){
		window.open($(this).attr('href'),'','width=732, height=600, menubar=no, status=no,');
		event.preventDefault();
		return false;
	});
	/**
	 * Eleve list listener at Module Absence
	 */
	$(".btn-eleve-absence").click(function(){
		//var form = $(this).parent('form');
		$(this).removeAttr("onclick");
		var dateInput = $(this).next('input');
		var href = $(this).attr('href');
		dateInput.attr('placeholder','Choissisez une semaine').datepicker({
			showOtherMonths:true,
			autoSize: true,
			dateFormat: 'mm/dd/yy',
			showWeek: true,
			firstDay: 1,
			onClose: function(){
				dateInput.removeAttr('placeholder');
			},
			onSelect: function(){
				var date = new Date(dateInput.val());
				date = date.getMonday();
				dateInput.val(date.getFullYear()+'-'+(date.getDigitMonth())+'-'+date.getDate());
				href += '?&date='+date.getFullYear()+'-'+(date.getDigitMonth())+'-'+date.getDate();
				//form.submit();
				window.location.href = href;
			}
		}).trigger('focus');
		return false;
	});
	
	
}
function postCustomFilterListener(){
	$(".absence-modify, .unblind").unbind('click');
	$(".absence-modify").click(function(e){
		$(this).next().toggle();
		e.preventDefault();
		return false;
	});
	
	$(".absence-select-change").on('change',function(){
		var form = $(this).parent().parent();
		var item = form.prev();
		var itemHTML = item.html();
		item.html(item.attr('data-loading-text'));
		var data = form.serialize();
		form.hide();
		if(form.find('select').val()!="absence_null"){
			$.post(form.attr('action'),data).done(function(data){
				item.css('background-color',form.find('option:selected').attr('data-color'));
				item.html(itemHTML);
			});
		}else{
			item.remove();
			form.next('a').show().trigger('click');
		}
	});
}