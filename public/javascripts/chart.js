				$( document ).ready( function () {
					$( '#pin' ).numpad( {
						hidePlusMinusButton: true,
						hideDecimalButton: true
					} );
				} );

				$( function () {

					var d = JSON.parse( $( '#data' ).text() );

					//alert( Date.parse( punchdata[ 0 ].in ) );



					// first correct the timestamps - they are recorded as the daily
					// midnights in UTC+0100, but Flot always displays dates in UTC
					// so we have to add one hour to hit the midnights in the plot
					/*
									for ( var i = 0; i < d.length; ++i ) {
										d[ i ][ 0 ] += 60 * 60 * 1000;
									}
					*/
					// helper for returning the weekends in a period

					function weekendAreas( axes ) {

						var markings = [],
							d = new Date( axes.xaxis.min );

						// go to the first Saturday

						d.setUTCDate( d.getUTCDate() - ( ( d.getUTCDay() + 1 ) % 7 ) );
						d.setUTCSeconds( 0 );
						d.setUTCMinutes( 0 );
						d.setUTCHours( 0 );

						var i = d.getTime();

						// when we don't set yaxis, the rectangle automatically
						// extends to infinity upwards and downwards

						do {
							markings.push( { xaxis: { from: i, to: i + 2 * 24 * 60 * 60 * 1000 } } );
							i += 7 * 24 * 60 * 60 * 1000;
						} while ( i < axes.xaxis.max );

						return markings;
					}

					var options = {
						xaxis: {
							mode: "time",
							tickLength: 5
						},
						selection: {
							mode: "x"
						},
						grid: {
							markings: weekendAreas
						}
					};

					var plot = $.plot( "#placeholder", d, options );

					var overview = $.plot( "#overview", d, {
						series: {
							lines: {
								show: true,
								lineWidth: 2
							},
							shadowSize: 0
						},
						xaxis: {
							ticks: [],
							mode: "time"
						},
						yaxis: {
							ticks: [],
							min: 0,
							autoscaleMargin: 0.1
						},
						selection: {
							mode: "x"
						}
					} );

					// now connect the two

					$( "#placeholder" ).bind( "plotselected", function ( event, ranges ) {

						// do the zooming
						$.each( plot.getXAxes(), function ( _, axis ) {
							var opts = axis.options;
							opts.min = ranges.xaxis.from;
							opts.max = ranges.xaxis.to;
						} );
						plot.setupGrid();
						plot.draw();
						plot.clearSelection();

						// don't fire event on the overview to prevent eternal loop

						overview.setSelection( ranges, true );
					} );
					$( "#overview" ).bind( "plotselected", function ( event, ranges ) {
						plot.setSelection( ranges );
					} );
				} );