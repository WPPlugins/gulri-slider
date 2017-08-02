<?php

	global $gulri;

	$gulri = false;

	

	include('gsp.inc.php');

	//FOR QUICK DEBUGGING

	if(!function_exists('pre')){

	function pre($data){

			if(isset($_GET['debug'])){

				pree($data);

			}

		}	 

	} 	

	if(!function_exists('pree')){

	function pree($data){

				echo '<pre>';

				print_r($data);

				echo '</pre>';	

		

		}	 

	} 

	

	function gsp_px($var, $px=true){

		

		$gsp_settings = get_option('gsp_settings');

		if(isset($gsp_settings[$var]) && $gsp_settings[$var]>0){

			return (int)$gsp_settings[$var].($px?'px':'');

		}else{

			return 'auto';

		}

	}



	function register_gsp_scripts($hook_suffix) {


		wp_register_style( 'gsp-style', plugins_url('css/style.css', __FILE__) );

		wp_register_style( 'gsp-common', plugins_url('css/common.css', __FILE__) );

		

		wp_register_style( 'gsp-admin', plugins_url('admin-style.css', __FILE__) );

		

		wp_enqueue_script('jquery');

		

		wp_enqueue_style( 'gsp-common' );	

		

		if(is_admin()){

			wp_enqueue_style( 'gsp-admin' );

			

	

		}else {

			$value = get_option('selected_slider');

			if ($value == 'default' || $value == "") {

				wp_enqueue_script(

					'gsp-scripts',

					plugins_url('js/scripts.js', __FILE__)

				);	

				

				wp_register_style( 'gsp-styles', plugins_url('css/gsp.css', __FILE__) );

				wp_enqueue_style( 'gsp-styles' );





				wp_register_style( 'gsp-flexslider', plugins_url('css/flexslider.css', __FILE__) );

				wp_enqueue_style( 'gsp-flexslider' );





				wp_register_style( 'gsp-animate', plugins_url('css/animate.css', __FILE__) );

				wp_enqueue_style( 'gsp-animate' );



				

				wp_enqueue_script(

					'gsp-scripts',

					plugins_url('js/gsp.js', __FILE__)

				);	

				

				wp_enqueue_script(

					'gsp-flexslider',

					plugins_url('js/jquery.flexslider-min.js', __FILE__)

				);	

				

				wp_enqueue_script(

					'gsp-easing',

					plugins_url('js/jQuery.easing.min.js', __FILE__)

				);

				

			}else if($value == 'zpingu') {



				wp_register_style( 'zpingu-style', plugins_url('addons/zpingu-effects/css/zpingu-style.css', __FILE__) );

				wp_enqueue_style( 'zpingu-style' );



				wp_enqueue_script(

				'gsp-zpinguslider',

				plugins_url('addons/zpingu-effects/js/jssor.slider-20.min.js', __FILE__)

				);





			}

			else if($value == 'ux') {



				wp_register_style( 'animate-style', plugins_url('addons/ux-effects/css/animate5152.css', __FILE__) );

				wp_enqueue_style( 'animate-style' );

				

				wp_register_style( 'font-icomoon-style', plugins_url('addons/ux-effects/css/font-icomoon5152.css', __FILE__) );

				wp_enqueue_style( 'font-icomoon-style' );


				wp_register_style( 'photoframe-style', plugins_url('addons/ux-effects/css/photoframe5152.css', __FILE__) );

				wp_enqueue_style( 'photoframe-style' );


				wp_register_style( 'responsive-style', plugins_url('addons/ux-effects/css/responsive5152.css', __FILE__) );

				wp_enqueue_style( 'responsive-style' );


				wp_enqueue_script(

				'gsp-ux-photoFrame',

				plugins_url('addons/ux-effects/js/photoFrame.js', __FILE__)

				);

				

			}		

		}

		

	}	

		

	

	function gsp_menu()

	{



		 add_options_page('Gulri Slider', 'Gulri Slider', 'update_core', 'gsp_slider', 'gsp_slider');



	}



	function gsp_slider() 



	{ 



		if ( !current_user_can( 'update_core' ) )  {



			wp_die( __( 'You do not have sufficient permissions to access this page.' ) );

		}

		

		if (isset($_POST['selected_slider'])) {

			update_option('selected_slider', $_POST['selected_slider']);		

				

		}

		

		if (isset($_POST['gsp_settings'])) {

		

			update_option('gsp_settings', $_POST['gsp_settings']);

			//pree(get_option('gsp_settings'));

			//pree($_POST);exit;	

			

		}



		include('gsp_settings.php');	

		



}

	function gsp_get_include_contents($filename) {

		$filename =  plugin_dir_path(__FILE__).$filename;

		if (is_file($filename)) {

			ob_start();

			include $filename;

			return ob_get_clean();

		}

		return false;

	}	

	

	function gsp_plugin_links($links) { 

		global $gs_premium_link;

		

		$gs_premium_link = '<a href="'.$gs_premium_link.'" title="Go Premium" target=_blank>Go Premium</a>'; 

		array_unshift($links, $gs_premium_link); 

		return $links; 

	}





	

	function gp_attachment_fields( $form_fields, $post ) {

		$form_fields['be-gp-text'] = array(

			'label' => 'Slider Text',

			'input' => 'textarea',

			'value' => get_post_meta( $post->ID, 'be_gp_text', true ),

			'helps' => '',

		);

	

		$form_fields['be-gp-caption'] = array(

			'label' => 'Link Text',

			'input' => 'textarea',

			'value' => get_post_meta( $post->ID, 'be_gp_caption', true ),

			'helps' => '',

		);

		

		$form_fields['be-gp-url'] = array(

			'label' => 'URL',

			'input' => 'text',

			'value' => get_post_meta( $post->ID, 'be_gp_url', true ),

			'helps' => '',

		);		
		
		
		$form_fields['be-display-home'] = array(

			'label' => 'Display On',

			'value' => get_post_meta( $post->ID, 'be_gp_dm', true ),

			'helps' => '',

		);	

	

		return $form_fields;

	}

	

	add_filter( 'attachment_fields_to_edit', 'gp_attachment_fields', 10, 2 );



	function gsp_meta($arr, $key){

		return ((!empty($arr) && isset($arr[$key]))?current($arr[$key]):'');

	}

	

	function gp_attachment_fields_save( $post, $attachment ) {

		if( isset( $attachment['be-gp-text'] ) )

		update_post_meta( $post['ID'], 'be_gp_text', $attachment['be-gp-text'] );

	

		if( isset( $attachment['be-gp-url'] ) )

		update_post_meta( $post['ID'], 'be_gp_url', esc_url( $attachment['be-gp-url'] ) );

		

		if( isset( $attachment['be-gp-caption'] ) )

		update_post_meta( $post['ID'], 'be_gp_caption', $attachment['be-gp-caption']);
		
		
		if( isset( $attachment['be-display-home'] ) )

		update_post_meta( $post['ID'], 'be_gp_dm', $attachment['be-display-home']);		

	

		return $post;

	}

	

	add_filter( 'attachment_fields_to_save', 'gp_attachment_fields_save', 10, 2 );



	function gsp_footer_scripts(){
?>
	<style type="text/css">

	</style>
<?php		
	}
	add_action('wp_footer', 'gsp_footer_scripts');

	add_shortcode('GSWC-SLIDER', 'gsp_wc_slider');
	
	if(!function_exists('gsp_wc_slider')){
		function gsp_wc_slider(){
			$args = array(
				'posts_per_page'   => 12,
				'offset'           => 0,
				'category'         => '',
				'category_name'    => '',
				'orderby'          => 'title',
				'order'            => 'ASC',
				'include'          => '',
				'exclude'          => '',
				'meta_key'         => '',
				'meta_value'       => '',
				'post_type'        => 'product',
				'post_mime_type'   => '',
				'post_parent'      => '',
				'author'	   => '',
				'author_name'	   => '',
				'post_status'      => 'publish',
				'suppress_filters' => true 
			);
			$posts_array = get_posts( $args );
			//pree($posts_array);
			$symbol = (function_exists('get_woocommerce_currency_symbol')?get_woocommerce_currency_symbol():'$');
			
			?>
				<div id="wc-sequence" class="seq">
			
				<div class="seq-screen">
				  <ul class="seq-canvas">
			<?php 
					foreach ( $posts_array as $post ) :  
					
					$price = $symbol.get_post_meta($post->ID, '_price', true);
					$src = get_the_post_thumbnail_url($post->ID);
					
					if($src!=''){
			
			?>        
					<li id="img_<?php echo $post->ID; ?>" class="seq-in">
					  <div class="seq-model">
						<img src="<?php echo $src; ?>" alt="A female model with long curly brown hair wears a gray sweater, brown shorts, bright yellow socks, and black high heel shoes. She raises one leg, and tilts her head to the side" />
					  </div>
			
					  <div class="seq-title">
						<h2 data-seq><a href="<?php echo get_permalink($post->ID); ?>"><?php echo $post->post_title; ?></a> - <?php echo $price; ?></h2>
						<h3 data-seq><?php echo $post->post_excerpt; ?></h3>
					  </div>
					</li>
			<?php  
			  
					}
					
			
					endforeach; 
			?> 
				   
					
				  </ul>
				</div>
			
				<fieldset class="seq-nav" aria-controls="sequence" aria-label="Slider buttons">
				  <button type="button" class="seq-prev" aria-label="Previous">Previous</button>
				  <button type="button" class="seq-next" aria-label="Next">Next</button>
				</fieldset>
			
				<ul role="navigation" aria-label="Pagination" class="seq-pagination">
			<?php 
					foreach ( $posts_array as $post ) : 
					$src = get_the_post_thumbnail_url($post->ID, 'post-thumbnail');		
					if($src!=''){
			?>        
					<li id="img_<?php echo $post->ID; ?>"><a href="" rel="step1" title="<?php echo $post->post_title; ?>"><img src="<?php echo $src; ?>" /></a></li>
			<?php  
					}
					endforeach; 
			?>
				  
				  
				</ul>
			  </div>
	<?php          
		}
	}
	
	
	function gsp_wc_enqueue_scripts() {
	
		wp_enqueue_script( 'gsp-wc-script', plugins_url('addons/wc/default/modern-slide.js', __FILE__), array( 'jquery' ) );
		
		
		wp_enqueue_style( 'gsp-wc-styles', plugins_url('addons/wc/default/modern-slide.css', __FILE__), array(), date('Ymhi'));
		
		
	}
	add_action( 'wp_enqueue_scripts', 'gsp_wc_enqueue_scripts' );
	