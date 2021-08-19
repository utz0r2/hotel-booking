<?php
/*
Plugin Name: Hotel Booking Wordpress
Plugin URI: https://github.com/utz0r2/hotel-booking-wordpress
Author: Igor Veselov
Text Domain: hotel-booking-wordpress
Domain Path: hotel-booking-wordpress
Description: Plugin Hotel booking. Ideal solution for creating your own hotel's booking system.
Version: 0.1.0
Author URI: https://xfor.top/en
*/

if (!defined('ABSPATH')) {
    exit();
}

define('INC_DIR', plugin_dir_path(__FILE__) . 'includes/');
define('CLASSES_DIR', plugin_dir_path(__FILE__) . 'backend/classes/');
define('VIEWS_DIR', plugin_dir_path(__FILE__) . 'backend/views/');
define('ASSETS_DIR', plugin_dir_url(__FILE__) . 'assets/');
define('LIBS_DIR', plugin_dir_url(__FILE__) . 'assets/libs/');

function hb_activate_plugin_name()
{
    require_once INC_DIR . 'activator.php';
    HotelBooking_Activator::activate();
}

register_activation_hook(__FILE__, 'hb_activate_plugin_name');

function hb_deactivate_plugin_name()
{
    require_once INC_DIR . 'deactivator.php';
    HotelBooking_Deactivator::deactivate();
}

register_deactivation_hook(__FILE__, 'hb_deactivate_plugin_name');

include INC_DIR . 'helper.php';
include INC_DIR . 'ajax.php';

if (is_admin()) {
    require_once plugin_dir_path(__FILE__) . '/backend/init.php';
} else {
    require_once plugin_dir_path(__FILE__) . '/public/init.php';
}


