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

// Function to handle the Genex Slider shortcode
function gxslider_shortcode($atts) {
    // Set default attributes (matching block.json defaults)
    $atts = shortcode_atts(array(
        'slides' => '[]', // JSON-encoded array of slides (e.g., from media library IDs or URLs)
        'transition_effect' => 'fade',
        'arrow_style' => 'default',
        'slider_height' => 400,
        'autoplay_enabled' => false,
        'autoplay_duration' => 5,
        'show_dots' => true,
    ), $atts, 'gxslider');

    // Enqueue assets for shortcode usage
    wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', array(), '3.12.5', true);
    wp_enqueue_script('genex-slider-frontend', plugin_dir_url(__FILE__) . 'build/view.js', array('gsap'), '1.0.0', true);
    wp_enqueue_style('genex-slider-frontend-style', plugin_dir_url(__FILE__) . 'build/style-index.css', array(), '1.0.0');

    // Render the shortcode HTML
    ob_start();
    echo '<!-- Genex Slider Shortcode -->';
    echo '<div class="wp-block-genex-slider gxslider-shortcode" data-attributes="' . esc_attr(json_encode($atts)) . '">';
    echo '<!-- Slider content will be populated by view.js -->';
    echo '</div>';
    return ob_get_clean();
}
add_shortcode('gxslider', 'gxslider_shortcode');

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
