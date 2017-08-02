<?php global $gsp_data, $gsp_settings; 

	

	$value = get_option('selected_slider');

	

?>

<form method="post">

<div class="wrap gulri_settings_div">





        



<div class="icon32" id="icon-options-general"><br></div><h2>Gulri Slider <?php echo '('.$gsp_data['Version'].')'; ?> - Settings</h2>





	<ul>
    
    
    
    <li>
    <h3>Choose a slider type for WooCommerce Products:</h3>
    
    <code>
    
    &lt;?php echo do_shortcode('[GSWC-SLIDER]'); ?&gt;
    <br /><br />
    Or
    <br /><br />    
    [GSWC-SLIDER]
    
    </code>
    
    </li>
    

    <li><label for="image_width">Image Width:</label>

<input id="image_width" type="text" name="gsp_settings[image_width]" placeholder="900" value="<?php echo gsp_px('image_width', false); ?>" style="width:60px" /><?php echo gsp_px('image_width', false)>0?'px':''; ?>

</li>

	<li>



    <li><label for="image_height">Image Height:</label>

<input id="image_height" type="text" name="gsp_settings[image_height]" placeholder="700" value="<?php echo gsp_px('image_height', false); ?>" style="width:60px" /><?php echo gsp_px('image_height', false)>0?'px':''; ?>

</li>


    <li><label for="image_height">Navigation Color:</label>

<input id="nav_color" type="text" name="gsp_settings[nav_color]" placeholder="#fff" value="<?php echo $gsp_settings['nav_color']; ?>" style="width:60px" />
</li>

	<li>    



	<h3>Choose a slider type for posts and pages:</h3>



	<div class="gsp_img_wrapper"><img id="default" <?php if ($value == 'default' || $value == "") { echo 'class="selected"';} ?> src="<?php echo plugins_url('images/gsp_slider.jpg', __FILE__); ?>" alt="Gsp Slider"></div>

	<div class="gsp_img_wrapper"><img id="zpingu" <?php if ($value == 'zpingu') { echo 'class="selected"';} ?> src="<?php echo plugins_url('images/zpingu-effects.jpg', __FILE__); ?>" alt="Zpingu Effects"></div>

	<div class="gsp_img_wrapper"><img id="ux" <?php if ($value == 'ux') { echo 'class="selected"';} ?> src="<?php echo plugins_url('images/ux-effects.jpg', __FILE__); ?>" alt="UX Effects"></div>

	



	</li>

    </ul>

	<script type="text/javascript" language="javascript">

		jQuery(document).ready(function($) {

			$('.gsp_img_wrapper').on('click', 'img', function(){

				$('input[name="selected_slider"]').val($(this).attr('id'));

				$('.gsp_img_wrapper').find('.selected').removeClass('selected');

				$(this).addClass('selected');

			});

		});



	</script>

    

    

    <div style="clear:both; position:relative; top:40px; float:right;">

    

		<input type="hidden" name="selected_slider" value="<?php echo $value; ?>">

		<input type="submit" value="Save Changes" class="button button-primary button-large">

	

    </div>

    

</div>

</form>