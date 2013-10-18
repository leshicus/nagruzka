<?
require_once("./../include.php");

$query = "
		select
		  audid      as ID,
		  roomnumber as NAME,
		  substr(abbreviation,0,1) as BUILD,
		  decode(substr(abbreviation,0,1),
		    1, substr(roomnumber,1,1),
		    2, substr(roomnumber,2,1),
		    3, substr(roomnumber,2,1)
		  ) as LVL,
		  decode(gadget,
		    null, 0,
		    1, 1
		  ) as TSO
		from AUDITOR_FULL
		order by audid
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