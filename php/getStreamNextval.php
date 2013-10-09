<?
require_once("./../include.php");

try {
    $query = "
      select
          SEQ_NAG_POTOK.nextval as stream
      from dual
	";

    $result = oci_parse($conn, $query);

    if (!(oci_execute($result))) throw new Exception;

    while ($row = oci_fetch_array($result, OCI_ASSOC)) {
        $output[] = $row;
    }

    //echo '{success: true, stream:' . $output[0]['STREAM'] . '}';
    echo json_encode(array('success' => true, 'stream' => $output[0]['STREAM']));
} catch (Exception $e) {
    echo json_encode(array('success' => false, 'error' => $e));
}
if ($conn)
    oci_close($conn);
?>