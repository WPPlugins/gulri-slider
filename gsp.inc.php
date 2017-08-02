<?php
	
	
	global $gsp_li;
	
	$gsp_li = "<li class='gsp_set' data-set='last'><img title='Enlarge' class='image-preview' src='' /><input type='hidden' name='gsp_attachments[]' class='gsp_attachments' value='' /><a title='Remove'>X</a>";
	
	
	
	
	function gsp_func( $atts ) {
	
			global $gulri;
	
			$gulri = true;
	
			if(is_single() || is_front_page() || is_page()){
				
			}else{
				return '';
			}
					
	
			ob_start();
	
			
	
			$gsp_content = '';
	
				
	
			$atts = shortcode_atts( array(
	
			  'ids' => '',
			  'width' => '',
			  'height' => '',		  
	
			), $atts );
	
			
	
			$atts['ids'] = ($atts['ids']!='' && is_array(explode(',', $atts['ids']))?explode(',', $atts['ids']):array());
	
			
	
				
	
				
	
			if(count($atts['ids'])>0){
	
				$gallery_id = date('Ymdhis');
	
	
	
				$images = array('full'=>array(), 'thumbs'=>array(), 'width'=>$atts['width'], 'height'=>$atts['height']);
	
				$i=0;
	
				
	
				 
	
				
	
				$value = get_option('selected_slider');
	
	
	
	
	
				  switch ($value) {
	
						case "default":
	
						default:
	
						foreach($atts['ids'] as $id){
	
			
	
							 $image = wp_get_attachment_image_src( $id, 'full');
	
							 
	
							 if(!empty($image)){
	
								$i++;
	
							 $images['full'][] = '<li style="'.($i>1?'display: none;':'').' width: 100%;"><img src="'.current($image).'" class="slider-'.$gallery_id.' slide-'.$id.' colorbox-'.$gallery_id.'" height="363" /></li>';
	
							 $image = wp_get_attachment_image_src( $id, 'thumbnail');
	
							 $images['thumbs'][] = '<li class="ms-thumb slide-'.$id.'"><img class="colorbox-'.$gallery_id.'"  src="'.current($image).'" /></li>';
	
							 }
	
							}
	
							include('front/gsp.go.php');
	
							break;
	
	
	
						case "zpingu":
	
						foreach($atts['ids'] as $id){
	
							 $image = wp_get_attachment_image_src( $id, 'full');
	
							 $meta = (get_post_meta($id));
	
							 //pree($meta);
	
							 if(!empty($image)){
	
								$i++;
	
							 $images['full'][] = '<div style="'.($i>1?'display: none;':'').' width: 100%;"><img data-text="'.gsp_meta($meta, 'be_gp_text').'" data-url="'.gsp_meta($meta, 'be_gp_url').'" data-caption="'.gsp_meta($meta, 'be_gp_caption').'" src="'.current($image).'" class="slider-'.$gallery_id.' slide-'.$id.' colorbox-'.$gallery_id.'" /><div class="slider_data"><h1>'.gsp_meta($meta, 'be_gp_text').'</h1>
	
	<div><a class="btn-play2" href="'.gsp_meta($meta, 'be_gp_url').'">Play</a></div>
	
	<div><a class="btn-schedule" href="'.gsp_meta($meta, 'be_gp_url').'">'.gsp_meta($meta, 'be_gp_caption').'</a></div></div></div>';
	
							 $image = wp_get_attachment_image_src( $id, 'thumbnail');
	
							 $images['thumbs'][] = '<div class="ms-thumb slide-'.$id.'"><img class="colorbox-'.$gallery_id.'"  src="'.current($image).'" /></div>';
	
							 }
	
							}
	
							include('addons/zpingu-effects/front/zpingu.go.php');
	
							break;
	
	
	
						case "ux":
	
						foreach($atts['ids'] as $id){
	
							 $image = wp_get_attachment_image_src( $id, 'full');
	
							 
	
							 if(!empty($image)){
	
								$i++;
	
								$thumb = wp_get_attachment_image_src( $id, 'thumbnail');
	
							 $images['full'][] = '<div class="photography '.($i==1?'active':'').' type-image"
	
												 data-type="image"
	
												 data-image-id="'.$id.'"
	
												 data-likes-count="'.$id.'"
	
												 data-src="'.current($image).'"
	
												 data-full="'.current($image).'"
	
												 data-thumb="'.current($thumb).'"
	
												 data-skin="dark"
	
												 data-thumb-side="'.current($thumb).'"
	
												 data-gallery-type="thumbs"
	
												 data-alt="">
	
																<div class="inner-preloader">
	
													<div class="loadingspin"></div>
	
												</div>
	
	
	
												
	
											</div>';
	
							 
	
							 $images['thumbs'][] = '<div class="photo-thumb cover_bg '.($i==1?'active':'').'"
	
					 style="background-image: url('.current($thumb).')">
	
					<div class="vignette-overlay"></div>
	
				</div>';
	
	
	
							 }
	
							}
	
							include('addons/ux-effects/front/ux.go.php');
	
							break;
	
					} 
	
				}
	
				$gsp_content = ob_get_clean(); 			
	
				
	
			
	
				
	
	
	
			
	
			return $gsp_content;
	
	}
	
	add_shortcode( 'gsp', 'gsp_func' );
	
	
	
	/**
	
	 * Adds a box to the main column on the Post and Page edit screens.
	
	 */
	
	function gsp_add_meta_box() {
	
	
	
		$screens = array( 'post', 'page' );
	
	
	
		foreach ( $screens as $screen ) {
	
	
	
			add_meta_box(
	
				'gsp_sectionid',
	
				__( 'Gallery Images', 'gsp_textdomain' ),
	
				'gsp_meta_box_callback',
	
				$screen
	
			);
	
		}
	
	}
	
	add_action( 'add_meta_boxes', 'gsp_add_meta_box' );
	
	
	
	/**
	
	 * Prints the box content.
	
	 * 
	
	 * @param WP_Post $post The object for the current post/page.
	
	 */
	
	function gsp_meta_box_callback( $post ) {
	
	
		global $gsp_li;
		// Add an nonce field so we can check for it later.
	
		wp_nonce_field( 'gsp_meta_box', 'gsp_meta_box_nonce' );

		wp_enqueue_media();
		
		
		$gsp_attachments = get_post_meta( $post->ID, 'gsp_attachments', true);
		$gsp_attachments  = is_array($gsp_attachments)?$gsp_attachments:array();
		?>
        <form method='post'>
        	<?php wp_nonce_field( 'gsp_gallery_act', 'gsp_gallery' ); ?>
			<ul class='gsp-image-wrapper'>
            	<?php
				if(!empty($gsp_attachments)){
					foreach($gsp_attachments as $att){
					
						echo str_replace(array("src=''", "value=''"), array('src="'.wp_get_attachment_url($att).'"', 'value="'.$att.'"'), $gsp_li);
				
					}
				}
				else{
?>
					<img class='image-preview' src='' />
                    <input type='hidden' name='gsp_attachments[]' class='gsp_attachments' value='' />
<?php
				}
				?>
                
			</ul>	
			</div>
			<input id="gsp_upload_button" type="button" class="button" value="<?php _e( 'Upload image' ); ?>" />
			
			<input type="submit" name="submit_image_selector" value="Save" class="button-primary">
            <?php if(!empty($gsp_attachments)){ ?><br />
			<h4>Shortcode for Slider:</h4>
            <input class="gsp_slider_code" type="text" readonly="readonly" value='[gsp ids="<?php echo implode(',', $gsp_attachments); ?>"]' style="width:100%" />
            <h4>Shortcode for Gallery:</h4>
            <input class="gsp_gallery_code" type="text" readonly="readonly" value='[gallery ids="<?php echo implode(',', $gsp_attachments); ?>"]' style="width:100%" />
            <?php } ?>
		</form><?php
	}
	
	add_action( 'admin_footer', 'gsp_selector_print_scripts' );
	
	
	function gsp_meta_box_saved($post_id){
		
		if ( isset( $_POST['submit_image_selector'] ) && isset( $_POST['gsp_attachments'] ) ){
			if ( 
				! isset( $_POST['gsp_gallery'] ) 
				|| ! wp_verify_nonce( $_POST['gsp_gallery'], 'gsp_gallery_act' ) 
			) {
			
			   print 'Sorry, your nonce did not verify.';
			   exit;
			
			} else {			
							
				$gsp_attachments = array_filter($_POST['gsp_attachments'], 'strlen');
				$gsp_attachments = array_intersect_key($gsp_attachments, array_flip(array_filter(array_keys($gsp_attachments), 'is_numeric')));
				//pree($gsp_attachments);exit;
				update_post_meta( $post_id, 'gsp_attachments', $gsp_attachments );
			}

		}
		//pree($_POST);exit;
	}
		
	add_action( 'save_post', 'gsp_meta_box_saved' );
		
	function gsp_selector_print_scripts() {
		global $post, $gsp_li;
		$gsp_attachments = get_post_meta( $post->ID, 'gsp_attachments', true);
		$gsp_attachments  = is_array($gsp_attachments)?$gsp_attachments:array();
		?><script type='text/javascript'>
		
		
			var set_to_post_id = 0;
			
			var gsp_li = "<?php echo $gsp_li; ?>";

			var images_to_ids = [];	
			
			jQuery( document ).ready( function( $ ) {
				
					
				
				
				function gsp_shortcode_update($){
					
					var idz = images_to_ids.join();
					
					$('.gsp_slider_code').val('[gsp ids="'+idz+'"]');
					
					$('.gsp_gallery_code').val('[gallery ids="'+idz+'"]');
					
				}				
				
				$('.postbox-container').on('click', '.gsp-image-wrapper a', function(){
					
					var id = parseInt($(this).parent().find('.gsp_attachments').val());
					
					var index = images_to_ids.indexOf(id);
					
					//document.title = id+' > '+index+' > '+(index > -1);
					
					if (index > -1) {
						images_to_ids.splice(index, 1);
					}
					
					$(this).parent().remove();
					gsp_shortcode_update($);
					
					
				});
					
				$('.postbox-container').on('click', '.gsp-image-wrapper img', function(){
				
					if($(this).attr('src')!='')
					window.open($(this).attr('src'), 'Preview');
				});				
				// Uploading files
				var file_frame;
				var wp_media_post_id = wp.media.model.settings.post.id; // Store the old id
				
				<?php 
				if(!empty($gsp_attachments)){
					$c = 0;
					foreach($gsp_attachments as $id){ 
						echo 'images_to_ids['.$c.'] = '.$id.';'; 
						$c++;
					}
				}else{
					echo 'images_to_ids[0] = 0;';
				}
				
				?> 
				// Set this
				jQuery('#gsp_upload_button').on('click', function( event ){
					event.preventDefault();
					// If the media frame already exists, reopen it.
					if ( file_frame ) {
						// Set the post ID to what we want
						file_frame.uploader.uploader.param( 'post_id', set_to_post_id );
						// Open frame
						file_frame.open();
						return;
					} else {
						// Set the wp.media post id so the uploader grabs the ID we want when initialised
						wp.media.model.settings.post.id = set_to_post_id;
					}
					// Create the media frame.
					file_frame = wp.media.frames.file_frame = wp.media({
						title: 'Select an image to upload',
						button: {
							text: 'Use this image',
						},
						multiple: true	// Set to true to allow multiple files to be selected
					});
					// When an image is selected, run a callback.
					file_frame.on( 'select', function() {
						// We set multiple to false so only get one image from the uploader
						
						attachment = file_frame.state().get('selection').toJSON();
						var selection = file_frame.state().get('selection');
						selection.map( function( attachment ) {
						
							att = attachment.toJSON();
							//document.title = att.id;
							if(images_to_ids.indexOf(att.id)<0){
								
								$('li[data-set="last"]').removeAttr('data-set');
								
								$('.gsp-image-wrapper').append(gsp_li);
								
								$('li[data-set="last"]').find('img').attr( 'src', att.url );
								
								$('li[data-set="last"]').find('input[type="hidden"]').val(att.id);							
								
								
								images_to_ids.push(att.id);
								
								
							}else{
								
							}

						});
						gsp_shortcode_update($);
						// Restore the main post ID
						wp.media.model.settings.post.id = wp_media_post_id;
					});
						// Finally, open the modal
						file_frame.open();
				});
				// Restore the main ID when the add media button is pressed
				jQuery( 'a.add_media' ).on( 'click', function() {
					wp.media.model.settings.post.id = wp_media_post_id;
				});
			});
		</script><?php
	}