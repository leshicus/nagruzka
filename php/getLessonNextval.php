<?
require_once("./../include.php");

$typeId = $_REQUEST['typeId'];

switch ($typeId) {
    case '1':
    case '2':
    case '3':
        $query_id = "select
                     SEQ_NAGRUZKA_RASPRED.nextval as id
                     from dual";
        break;
    case '4':
    case '5':
    case '6':
        $query_id = "select
                     seq_nagruzka_30032013_rep.nextval as id
                     from dual";
        break;
}

try {
    $result = oci_parse($conn, $query_id);
    if (!(oci_execute($result))) throw new Exception;
    while ($row = oci_fetch_array($result, OCI_ASSOC)) {
        $output[] = $row;
    }
    oci_free_statement($result);
    echo json_encode(array('success' => true, 'id' => $output[0]['ID']));
} catch (Exception $e) {
    echo json_encode(
        array('success' => false,
            'message' => $query));
}

if ($conn)
    oci_close($conn);
?>