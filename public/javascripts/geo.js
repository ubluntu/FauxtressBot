if (navigator.geolocation) {
	alert(navigator.geolocation.getCurrentPosition());
} else {
	error('Geo Location is not supported');
}