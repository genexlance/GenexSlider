/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck, InspectorControls, URLInputButton } from '@wordpress/block-editor';
import { Button, PanelBody, SelectControl, Placeholder, ToggleControl, __experimentalNumberControl as NumberControl, BaseControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';

// Define Arrow Styles with SVG Previews
const arrowStyleOptions = [
    {
        value: 'default',
        label: __('Default', 'genex-slider'),
        preview: '< >'
    },
    {
        value: 'square-solid',
        label: __('Square Solid', 'genex-slider'),
        // SVG for a solid square with an arrow (left arrow example)
        preview: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 4h16v16H4z" fillRule="evenodd" clipRule="evenodd"/><path d="M13.414 8.586L9.828 12l3.586 3.414 1.414-1.414L12.657 12l2.171-2.172-1.414-1.414z" fill="white"/></svg>
    },
    {
        value: 'chevron-large',
        label: __('Chevron Large', 'genex-slider'),
        // SVG for a large chevron arrow (left arrow example)
        preview: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
    },
    {
        value: 'circle-solid',
        label: __('Circle Solid', 'genex-slider'),
        // SVG for a solid circle with an arrow (left arrow example)
        preview: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><circle cx="12" cy="12" r="11"/><path d="M13.414 8.586L9.828 12l3.586 3.414 1.414-1.414L12.657 12l2.171-2.172-1.414-1.414z" fill="white"/></svg>
    },
    {
        value: 'chevron-simple',
        label: __('Chevron Simple', 'genex-slider'),
        // SVG for a simple chevron arrow (left arrow example)
        preview: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    }
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates block attributes.
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();
    const { 
        slides = [], 
        transitionEffect, 
        arrowStyle, 
        autoplayEnabled, 
        autoplayDuration,
        showDots
    } = attributes;
    const [ currentSlideIndex, setCurrentSlideIndex ] = useState(0);

    const extractMediaDimension = (mediaItem, key) => {
        if (!mediaItem) {
            return null;
        }
        if (typeof mediaItem[key] === 'number') {
            return mediaItem[key];
        }
        const mediaDetails = mediaItem.media_details || mediaItem.mediaDetails;
        if (mediaDetails && typeof mediaDetails[key] === 'number') {
            return mediaDetails[key];
        }
        const fullSize = mediaDetails?.sizes?.full;
        if (fullSize && typeof fullSize[key] === 'number') {
            return fullSize[key];
        }
        return null;
    };

    const onSelectMedia = (media) => {
        const newSlides = media.map((img) => {
            const width = extractMediaDimension(img, 'width');
            const height = extractMediaDimension(img, 'height');

            return {
                id: img.id,
                url: img.url,
                alt: img.alt,
                link: { url: '', opensInNewTab: false, nofollow: false },
                backgroundPosition: 'center center',
                width,
                height
            };
        });
        setAttributes({ slides: [...slides, ...newSlides] });
        if (slides.length === 0) {
            setCurrentSlideIndex(0);
        }
    };

    const onRemoveSlide = (index) => {
        const newSlides = slides.filter((_, i) => i !== index);
        setAttributes({ slides: newSlides });
        // Adjust current slide index if necessary
        if (currentSlideIndex >= newSlides.length && newSlides.length > 0) {
            setCurrentSlideIndex(newSlides.length - 1);
        } else if (newSlides.length === 0) {
            setCurrentSlideIndex(0);
        }
    };

    const onSetLink = ( index, linkInfo ) => {
        const newSlides = slides.map( ( slide, i ) => {
            if ( i === index ) {
                // Ensure link object exists
                const currentLink = slide.link || { url: '', opensInNewTab: false, nofollow: false };
                return { ...slide, link: { ...currentLink, ...linkInfo } };
            }
            return slide;
        } );
        setAttributes( { slides: newSlides } );
    };

    const onSetBackgroundPosition = ( index, position ) => {
        const newSlides = slides.map( ( slide, i ) => {
            if ( i === index ) {
                return { ...slide, backgroundPosition: position };
            }
            return slide;
        } );
        setAttributes( { slides: newSlides } );
    };

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Slider Settings', 'genex-slider')}>
                    <SelectControl
                        label={__('Transition Effect', 'genex-slider')}
                        value={transitionEffect}
                        options={[
                            { label: __('Fade', 'genex-slider'), value: 'fade' },
                            { label: __('Blur', 'genex-slider'), value: 'blur' }, // Placeholder
                            { label: __('Slide Left/Right', 'genex-slider'), value: 'slide-horizontal' },
                        ]}
                        onChange={(value) => setAttributes({ transitionEffect: value })}
                    />
                     <BaseControl
                        label={__('Arrow Style', 'genex-slider')}
                        id="genex-slider-arrow-style-control"
                        className="genex-slider-arrow-style-control"
                    >
                        <div className="arrow-style-options-grid">
                            {arrowStyleOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    isPressed={arrowStyle === option.value}
                                    onClick={() => setAttributes({ arrowStyle: option.value })}
                                    className={`arrow-style-option-button ${arrowStyle === option.value ? 'is-selected' : ''}`}
                                    title={option.label}
                                >
                                    <span className="arrow-style-preview">
                                        {option.value === 'default' ? '< >' : option.preview}
                                    </span>
                                    {/* <span className="arrow-style-label">{option.label}</span> */}
                                </Button>
                            ))}
                        </div>
                    </BaseControl>

                    <ToggleControl
                        label={__('Enable Autoplay', 'genex-slider')}
                        checked={autoplayEnabled}
                        onChange={(value) => setAttributes({ autoplayEnabled: value })}
                    />
                    {autoplayEnabled && (
                        <NumberControl
                            label={__('Autoplay Duration (seconds)', 'genex-slider')}
                            isShiftStepEnabled={true}
                            onChange={(value) => setAttributes({ autoplayDuration: Number(value) || 5 })}
                            shiftStep={1}
                            step={0.5}
                            min={1}
                            value={autoplayDuration}
                        />
                    )}

                </PanelBody>
                <PanelBody title={__('Navigation', 'genex-slider')} initialOpen={ false }>
                    <ToggleControl
                        label={__('Show Dot Indicators', 'genex-slider')}
                        checked={showDots}
                        onChange={(value) => setAttributes({ showDots: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <MediaUploadCheck>
                <MediaUpload
                    onSelect={onSelectMedia}
                    allowedTypes={['image']}
                    multiple
                    gallery
                    value={slides.map((slide) => slide.id)}
                    render={({ open }) => (
                        <Button isPrimary onClick={open}>
                            {__('Upload/Select Images', 'genex-slider')}
                        </Button>
                    )}
                />
            </MediaUploadCheck>

            {slides.length === 0 && (
                 <Placeholder
                    icon="images-alt2"
                    label={__('Genex Slider', 'genex-slider')}
                    instructions={__('Upload images to create your slider.', 'genex-slider')}
                >
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectMedia}
                            allowedTypes={['image']}
                            multiple
                            gallery
                            render={({ open }) => (
                                <Button isPrimary onClick={open}>
                                    {__('Select Images', 'genex-slider')}
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                </Placeholder>
            )}

            {slides.length > 0 && (
                <div className="genex-slider-editor-preview">
                    <div className="slide-preview-container" style={{ position: 'relative', minHeight: '200px' /* Adjust as needed */ }}>
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`slide-preview ${index === currentSlideIndex ? 'is-active' : ''}`}
                                style={{ display: index === currentSlideIndex ? 'block' : 'none' }}
                            >
                                <div className="slide-image-wrapper" style={{ position: 'relative' }}>
                                    <img src={slide.url} alt={slide.alt || ''} />
                                    <div className="slide-actions" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
                                        <Button
                                            isDestructive
                                            icon="trash"
                                            label={__('Remove Slide', 'genex-slider')}
                                            onClick={() => onRemoveSlide(index)}
                                        />
                                    </div>
                                </div>
                                {/* Link Controls Below Preview */}
                                <div className="slide-link-controls" style={{ padding: '10px', borderTop: '1px dashed #ccc', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <URLInputButton
                                        url={ slide.link?.url }
                                        onChange={ ( url ) => onSetLink( index, { url } ) }
                                    />
                                    <ToggleControl
                                        label={__( 'New Tab', 'genex-slider' )}
                                        checked={ slide.link?.opensInNewTab }
                                        onChange={ ( value ) => onSetLink( index, { opensInNewTab: value } ) }
                                        style={{ marginBottom: 0 }} // Reduce margin for inline look
                                    />
                                </div>
                                {/* Background Position Control */} 
                                <div className="slide-bg-pos-controls" style={{ padding: '10px', borderTop: '1px dashed #eee' }}>
                                    <SelectControl
                                        label={__('Background Position', 'genex-slider')}
                                        value={ slide.backgroundPosition || 'center center' }
                                        onChange={ ( position ) => onSetBackgroundPosition( index, position ) }
                                        options={ [
                                            { label: 'Center Center', value: 'center center' },
                                            { label: 'Center Left', value: 'center left' },
                                            { label: 'Center Right', value: 'center right' },
                                            { label: 'Top Center', value: 'top center' },
                                            { label: 'Top Left', value: 'top left' },
                                            { label: 'Top Right', value: 'top right' },
                                            { label: 'Bottom Center', value: 'bottom center' },
                                            { label: 'Bottom Left', value: 'bottom left' },
                                            { label: 'Bottom Right', value: 'bottom right' },
                                        ] }
                                        __nextHasNoMarginBottom // Use new WP styling if available
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Simple Editor Navigation */}
                    {slides.length > 1 && (
                        <div className="editor-navigation">
                            <Button
                                icon="arrow-left-alt2"
                                onClick={() => setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length)}
                            />
                            <span>{`${currentSlideIndex + 1} / ${slides.length}`}</span>
                            <Button
                                icon="arrow-right-alt2"
                                onClick={() => setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length)}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 
