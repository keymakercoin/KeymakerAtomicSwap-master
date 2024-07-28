// DOM Ready =============================================================
$(document).ready(function() {

    $('#section-dashboard').show();
    $('#header-dashboard').show();
	$('#section-easydex').hide();
	$('#section-about-keymaker').hide();
	$('#nav-dashboard').removeClass( "" ).addClass( "active open" );
	$('#nav-easydex').removeClass( " active open" ).addClass( "" );
	$('#nav-about-keymaker').removeClass( " active open" ).addClass( "" );

});

$('#nav-dashboard').on('click', function() {
	$('#section-dashboard').show();
	$('#header-dashboard').show();
	$('#section-easydex').hide();
	$('#section-about-keymaker').hide();
	$('#nav-dashboard').removeClass( "" ).addClass( "active open" );
	$('#nav-easydex').removeClass( " active open" ).addClass( "" );
	$('#nav-about-keymaker').removeClass( " active open" ).addClass( "" );
});

$('#nav-easydex').on('click', function() {
	$('#section-dashboard').hide();
	$('#header-dashboard').hide();
	$('#section-easydex').show();
	$('#section-about-keymaker').hide();
	$('#nav-dashboard').removeClass( " active open" ).addClass( "" );
	$('#nav-easydex').removeClass( "" ).addClass( "active open" );
	$('#nav-about-keymaker').removeClass( " active open" ).addClass( "" );
});

$('#nav-about-keymaker').on('click', function() {
	$('#section-dashboard').hide();
	$('#header-dashboard').hide();
	$('#section-easydex').hide();
	$('#section-about-keymaker').show();
	$('#nav-dashboard').removeClass( " active open" ).addClass( "" );
	$('#nav-easydex').removeClass( " active open" ).addClass( "" );
	$('#nav-about-keymaker').removeClass( "" ).addClass( "active open" );
});

