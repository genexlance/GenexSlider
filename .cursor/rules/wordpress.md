🧠 WordPress Development Standards (GeneratePress/GenerateBlocks-Friendly)
🎯 General Approach
Use concise, accurate, and modular code.

Follow WordPress PHP Coding Standards.

Avoid core modifications — extend via hooks and filters.

Structure themes/plugins to be lightweight, especially when working with GeneratePress.

Make all customizations optional and override-friendly using hooks or theme filters.

🧰 Theme & Plugin Development
Use hooks (add_action, add_filter) for logic injection.

Keep custom logic in functions.php or a site plugin to ensure theme portability.

Prefer modular PHP classes when needed, especially for complex functionality.

🧩 GeneratePress-Specific
Enqueue assets conditionally using wp_enqueue_script() and wp_enqueue_style().

Avoid loading heavy scripts/styles unless needed.

Add custom blocks via GenerateBlocks hooks if extending block behavior.

Structure templates to match GeneratePress's template hierarchy (content-single.php, content-page.php, etc.).

🧱 Directory & Naming Conventions
Use:

lowercase-hyphen for directories.

camelCase or snake_case for variables.

Descriptive names for files, functions, and classes.

Example:

php
Copy
Edit
// themes/my-theme/functions/post-helpers.php
function mytheme_get_featured_image_url( int $post_id ): string {
    return get_the_post_thumbnail_url( $post_id, 'full' ) ?: '';
}
🧼 Security, Sanitization & Validation
Use:

sanitize_text_field(), sanitize_email(), etc.

wp_verify_nonce(), check_admin_referer() for nonces.

esc_html(), esc_url(), wp_kses_post() for output escaping.

🧪 Testing & Debugging
Use WP_UnitTestCase for testing.

Enable WP_DEBUG, WP_DEBUG_LOG, WP_DEBUG_DISPLAY in wp-config.php.

Catch and log errors gracefully in production:

php
Copy
Edit
try {
  // do something risky
} catch ( Exception $e ) {
  error_log( 'Caught exception: ' . $e->getMessage() );
}
⚙️ Custom Data & DB Operations
Use WP_Query, $wpdb->prepare(), get_option(), update_option() for DB ops.

For schema updates: dbDelta().

Use transients for caching: set_transient(), get_transient(), delete_transient().

📅 Task Scheduling
Use wp_schedule_event() and wp_cron for background tasks.

🌍 Internationalization
Wrap strings with __(), _e(), _x(), and load your text domain.

php
Copy
Edit
__( 'Hello, world!', 'mytheme' );
If you're using GenerateBlocks or GeneratePress Pro:

Use generateblocks/ and generatepress/ action/filter hooks for adjustments.

Avoid injecting unnecessary scripts into the block editor or frontend.

Want a boilerplate starter file or plugin that follows all this clean-ass philosophy? Gimme the word, you pixel-slingin' spaghetti coder 😏.