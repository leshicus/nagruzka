<?
require_once("./../include.php");

try {
    $query = "
		select
           v.divId     as ID,
           v.divabbreviate   as NAME
        from v_spi_kafedr    v
        order by v.divabbreviate
	";

    $result = oci_parse($conn, $query);

    if (!(oci_execute($result))) throw new Exception;
    while ($row = oci_fetch_array($result, OCI_ASSOC)) {
        $output[] = $row;
    }
    oci_free_statement($result);

    echo '{rows:' . json_encode($output) . '}';
} catch (Exception $e) {
    echo json_encode(array('success' => false, 'error' => $e));
}

?>