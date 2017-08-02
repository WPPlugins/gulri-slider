// JavaScript Document
jQuery(document).ready(function($){
	setTimeout(function(){
		if($('#wc-sequence').length>0){		
			$('#wc-sequence fieldset.seq-nav').fadeIn();
			$('#wc-sequence .seq-pagination li').eq(0).addClass('seq-current');
		}
	}, 1000);
	
	var seq_obj_str = '#wc-sequence .seq-pagination li';
	var main_img = '#wc-sequence .seq-screen .seq-canvas .seq-in';
	
	$('#wc-sequence').on('click', '.seq-nav button.seq-prev, .seq-nav button.seq-next', function(){
		
		var tc = $(this).hasClass('seq-next');
		
		
		var total = $(seq_obj_str).length;
		var curr = $(seq_obj_str+'.seq-current').index();
		
		$(main_img).hide();
		var last = (total-1);
		
		if(curr>=0 && curr<last)
		curr = (tc?curr+1:curr-1);
		else
		curr = (tc?0:last-1);
		
		$(seq_obj_str).removeAttr('class');
		$(seq_obj_str).eq(curr).addClass('seq-current');
		$(main_img).eq(curr).fadeIn();
	});
	
	$('#wc-sequence .seq-pagination li a').on('click', function(event){
		event.preventDefault();
		var li = $(this).parent();
		var ind = li.index();
		
		$(main_img).hide();
		$(seq_obj_str).removeAttr('class');
		$(seq_obj_str).eq(ind).addClass('seq-current');		
		$(main_img).eq(ind).fadeIn();
		
	});
	
});