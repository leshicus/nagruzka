<?
require_once("./../include.php");

$typeId = $_REQUEST['typeid'];

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
    $result = execq($query, false);
    foreach ($result as $i => $data)
        foreach ($data as $k => $v)
            $output[$i][strtolower($k)] = $v;
} catch (Exception $e) {
    $success = false;
    echo json_encode(
        array('success' => $success,
            'message' => $query));
}
if ($success) {
    echo '{rows:' . json_encode($output) . '}';
}

?>