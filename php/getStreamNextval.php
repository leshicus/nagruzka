<?
require_once("./../include.php");

$query = "
      select
          SEQ_NAG_POTOK.nextval as stream
      from dual
	";

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
    echo json_encode(
        array('success' => $success,
            'stream' => $output[0]['stream']));
}

?>