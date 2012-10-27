/*!
 * kort 0.1
 * http://lab.hakim.se/kort
 * MIT licensed
 *
 * Created by Hakim El Hattab (http://hakim.se, @hakimel)
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

		// Gotta have 3D transform support
		if( supports3DTransforms ) {

			arrayify( document.querySelectorAll( '.kort' ) ).forEach( function( element, i ) {

				// Make sure we don't bind to the same element twice
				if( !element.classList.contains( 'kort-activated' ) ) {

					element.classList.add( 'kort-activated' );

					if( 'ontouchstart' in window ) {
						element.addEventListener( 'touchstart', onTouchStart, false );
					}
					else {
						element.addEventListener( 'mouseover', onMouseOver, false );
						element.addEventListener( 'mouseout', onMouseOut, false );
						element.addEventListener( 'mousemove', onMouseMove, false );
					}

					function onMouseOver( event ) {
						addMargin();
					}

					function onMouseMove( event ) {
						updateClasses( event.clientX );
					}

					function onMouseOut( event ) {
						removeMargin();
					}

					function onTouchStart( event ) {
						addMargin();

						updateClasses( event.touches[0].clientX );

						element.classList.add( 'touching' );

						document.addEventListener( 'touchmove', onTouchMove, false );
						document.addEventListener( 'touchend', onTouchEnd, false );
					}

					function onTouchMove( event ) {
						updateClasses( event.touches[0].clientX );

						event.preventDefault();
					}

					function onTouchEnd( event ) {
						removeMargin();

						element.classList.remove( 'touching' );

						document.removeEventListener( 'touchmove', onTouchMove, false );
						document.removeEventListener( 'touchend', onTouchEnd, false );
					}

					function updateClasses( x ) {
						var index = Math.floor( ( x - element.offsetLeft ) / element.offsetWidth * element.children.length );

						index = Math.max( Math.min( index, element.children.length - 1 ), 0 );

						arrayify( element.children ).forEach( function( child, i ) {

							child.className = i === index ? 'present' : '';

						} );
					}

					function addMargin() {
						arrayify( element.children ).forEach( function( child, i ) {

							child.style.marginLeft = ( i * OFFSET_MARGIN ) + 'px';

						} );
					}

					function removeMargin() {
						arrayify( element.children ).forEach( function( child, i ) {

							child.style.marginLeft = 0;

						} );
					}

				}

			} );

		}

	}

	function arrayify( value ) {
		return [].slice.call( value );
	}

	bind();

	return {
		bind: bind
	};

})();
