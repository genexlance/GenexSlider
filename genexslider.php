<?php
/**
 * Plugin Name:       Genex Slider
 * Plugin URI:        #
 * Description:       A lightweight but fully featured slider block for Gutenberg.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Your Name
 * Author URI:        #
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       genex-slider
 * Domain Path:       /languages
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Function to register our block
function genex_slider_register_block() {
    // Register the block using the metadata loaded from block.json
    register_block_type( __DIR__ . '/build' );

    // Enqueue frontend script and style
    // We will add the script and style registration later
}
add_action( 'init', 'genex_slider_register_block' );

// Function to enqueue GSAP from CDN for the frontend
function genex_slider_enqueue_frontend_assets() {
    // Check if we are on the frontend and a genex-slider block exists
    // A more robust check will be needed later, possibly checking post content
    // For now, let's enqueue it if the block is registered
    // We need to ensure this only loads when the block is actually used.
    // Let's refine this later.

    // A better way is to enqueue scripts via block.json or render_callback
    // wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', array(), '3.12.5', true);

    // Enqueue our custom frontend script (we'll create this later)
    // wp_enqueue_script('genex-slider-frontend', plugin_dir_url(__FILE__) . 'build/frontend.js', array('gsap', 'wp-element', 'wp-blocks'), '1.0.0', true);

    // Enqueue our custom frontend style (we'll create this later)
    // wp_enqueue_style('genex-slider-frontend-style', plugin_dir_url(__FILE__) . 'build/frontend.css', array(), '1.0.0');
}
// add_action('wp_enqueue_scripts', 'genex_slider_enqueue_frontend_assets');

?>
