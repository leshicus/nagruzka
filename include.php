<?
	require_once("/var/www/study/include.php");
	require_once( $lib_debug );
	$conn = connect(false);
	if (!$conn) {
		$e = oci_error();
		echo htmlentities($e['message'])." (������ �������� � ����)";
	}
?>