<?
	require_once("/var/www/study/include.php");
	require_once( $lib_debug );
	$conn = connect(false);
	if (!$conn) {
		$e = oci_error();
		echo htmlentities($e['message'])." (������ �������� � ����)";
	}
    $success = true;

$nagruzka = "nagruzka_16102013";
$nagruzka_lec = "nagruzka_raspred";
$nagruzka_lab = "nagruzka_raspred";
$nagruzka_sem = "nagruzka_raspred";
$nagruzka_rep = "nagruzka_rep_16102013";
?>