<?
require_once("./../include.php");

$query = "
		select
           v.divId     as ID,
           v.divabbreviate   as NAME
        from v_spi_kafedr    v
        order by v.divabbreviate
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

    echo '{rows:' . json_encode($output) . '}';
}

?>