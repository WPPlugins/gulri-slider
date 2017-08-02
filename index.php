<?php 
/*

Plugin Name: Gulri Slider

Plugin URI: http://www.websitedesignwebsitedevelopment.com/gsp

Description: An easy way to shape your gallery into an elegant slider.

Version: 3.4.1

Author: Fahad Mahmood 

Author URI: http://www.androidbubbles.com

License: GPL2


This WordPress Plugin is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.
 
This free software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
 
You should have received a copy of the GNU General Public License
along with this software. If not, see http://www.gnu.org/licenses/gpl-2.0.html.
*/ 





	require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

 	

	global $gs_premium_link, $gsp_data, $gsp_settings;

    include('functions.php');

	

	$gsp_data = get_plugin_data(__FILE__);

	$gsp_settings = get_option('gsp_settings');

	$gs_premium_link = 'http://shop.androidbubbles.com/product/gulri-slider-pro';

	

	add_action( 'admin_enqueue_scripts', 'register_gsp_scripts' );

	add_action( 'wp_enqueue_scripts', 'register_gsp_scripts' );

	

	if(is_admin()){



		$plugin = plugin_basename(__FILE__); 

		add_filter("plugin_action_links_$plugin", 'gsp_plugin_links' );			



		add_action( 'admin_menu', 'gsp_menu' );	

	}



		

