/*!
 * kort 0.1
 * http://lab.hakim.se/kort
 * MIT licensed
 *
 * Copyright (C) 2011 Hakim El Hattab (http://hakim.se, @hakimel)
 */
var Kort = (function(){

	var OFFSET_MARGIN = 2;

	var supports3DTransforms =  'WebkitPerspective' in document.body.style ||
								'MozPerspective' in document.body.style ||
								'msPerspective' in document.body.style ||
								'OPerspective' in document.body.style ||
								'perspective' in document.body.style;

	/**
	 * Binds events for all elements with the class 'kort'.
	 */
	function bind() {

		// Properties that are read from the DOM when the user hovers
		// and then cached to avoid needless DOM interaction
		var elementLeft = 0,
			elementWidth = 0,
			elementChildren = [];

		// Gotta have 3D transform support
		if( supports3DTransforms ) {

			[].slice.call( document.querySelectorAll( '.kort' ) ).forEach( function( element, i ) {

				// Make sure we don't bind to the same element twice
				if( element.classList.contains( 'kort-activated' ) === false ) {
					element.classList.add( 'kort-activated' );

					function onMouseOver( event ) {
						updateState();
						addMargin();
					}

					function onMouseMove( event ) {
						update( event.clientX );
					}

					function onMouseOut( event ) {
						removeMargin();
					}

					function onTouchStart( event ) {
						updateState();
						addMargin();

						update( event.touches[0].clientX );

						element.classList.add( 'touching' );

						document.addEventListener( 'touchmove', onTouchMove, false );
						document.addEventListener( 'touchend', onTouchEnd, false );
					}

					function onTouchMove( event ) {
						update( event.touches[0].clientX );

						event.preventDefault();
					}

					function onTouchEnd( event ) {
						removeMargin();

						element.classList.remove( 'touching' );

						document.removeEventListener( 'touchmove', onTouchMove, false );
						document.removeEventListener( 'touchend', onTouchEnd, false );
					}

					function updateState() {
						elementLeft = element.offsetLeft;
						elementWidth = element.offsetWidth;
						elementChildren = [].slice.call( element.children );
					}

					function update( x ) {
						// Find the present element based on the x position
						var present = Math.floor( ( x - elementLeft ) / elementWidth * elementChildren.length );

						// Cap to 0 - number_of_elements
						present = Math.max( Math.min( present, elementChildren.length - 1 ), 0 );

						elementChildren.forEach( function( child, i ) {

							if( i === present ) {
								child.classList.add( 'present' );
							}
							else {
								child.classList.remove( 'present' );
							}

						} );
					}

					function addMargin() {
						elementChildren.forEach( function( child, i ) {

							child.style.marginLeft = ( i * OFFSET_MARGIN ) + 'px';

						} );
					}

					function removeMargin() {
						elementChildren.forEach( function( child, i ) {

							child.style.marginLeft = 0;

						} );
					}

					if( 'ontouchstart' in window ) {
						element.addEventListener( 'touchstart', onTouchStart, false );
					}
					else {
						element.addEventListener( 'mouseover', onMouseOver, false );
						element.addEventListener( 'mouseout', onMouseOut, false );
						element.addEventListener( 'mousemove', onMouseMove, false );
					}

				}

			} );

		}

	}

	// Bind elments that are currently in the DOM
	bind();

	return {
		bind: bind
	};

})();
