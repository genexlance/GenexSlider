/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props           Properties passed to the function.
 * @param {Object} props.attributes Available block attributes.
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
    const blockProps = useBlockProps.save();
    const { 
        slides = [], 
        transitionEffect, 
        arrowStyle, 
        sliderHeight, 
        autoplayEnabled, 
        autoplayDuration,
        showDots
    } = attributes;

    // If there are no slides, save nothing or a placeholder comment
    if (slides.length === 0) {
        return null; // Or return <div {...blockProps}></div>; if a wrapper is always needed
    }

    // Apply dynamic height style
    const blockStyles = { 
        minHeight: sliderHeight ? `${sliderHeight}px` : undefined 
    };

    return (
        <div 
            {...blockProps} 
            style={blockStyles} 
            data-transition-effect={transitionEffect}
            data-arrow-style={arrowStyle}
            data-autoplay={autoplayEnabled ? 'true' : 'false'}
            data-autoplay-duration={autoplayDuration}
            // Add a class to identify the block for frontend JS
            className={`${blockProps.className || ''} genex-slider-container`}
        >
            <div className="genex-slides">
                {slides.map((slide, index) => {
                    const hasLink = slide.link?.url;
                    const rel = [];
                    if (slide.link?.opensInNewTab) {
                        rel.push('noopener', 'noreferrer');
                    }
                    if (slide.link?.nofollow) {
                        rel.push('nofollow');
                    }

                    const slideInner = (
                        <div
                            key={slide.id || index} // Key might need to be on wrapper if hasLink
                            className="genex-slide"
                            data-slide-index={index}
                            style={{ 
                                backgroundImage: `url(${slide.url})`,
                                backgroundPosition: slide.backgroundPosition || 'center center'
                            }}
                        >
                            {/* Empty div */} 
                        </div>
                    );

                    return hasLink ? (
                        <a 
                            key={`link-${slide.id || index}`}
                            href={slide.link.url}
                            target={slide.link.opensInNewTab ? '_blank' : undefined}
                            rel={rel.length > 0 ? rel.join(' ') : undefined}
                            className="genex-slide-link-wrapper" // Add class for potential styling
                            style={{ display: 'block', width: '100%', height: '100%' }} // Ensure link wrapper fills area
                        >
                            {slideInner}
                        </a>
                    ) : (
                        slideInner
                    );
                })}
            </div>

            {/* Navigation Arrows - Structure for JS to add functionality */}
            {slides.length > 1 && (
                <>
                    <button type="button" className="genex-slider-nav genex-slider-prev" aria-label="Previous Slide"></button>
                    <button type="button" className="genex-slider-nav genex-slider-next" aria-label="Next Slide"></button>
                </>
            )}

            {/* Dots Navigation Structure */}
            {slides.length > 1 && showDots && (
                <div className="genex-slider-dots">
                    {slides.map((_, index) => (
                        <button 
                            type="button" 
                            key={index} 
                            className="genex-slider-dot" 
                            data-slide-index={index} 
                            aria-label={`Go to slide ${index + 1}`}>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
} 