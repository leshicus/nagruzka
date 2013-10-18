<?
require_once("./../include.php");
$success = true;
$divId = $_REQUEST['divid'];
$str = "";

if($divId){
    $str = " and divid =". $divId.' ';
}

$query = "
		select
           max(v.prepod_id) as ID,
           initcap(max(v.FIO) || ' (' || max(v.dol_small) || ')')   as NAME,
           v.divID                    as DIVID,
           initcap(v.fio_prepod)      as FIO_FULL,
           initcapf(max(v.dol_small)) as JOB
        from V_SPI_PREPOD_NAGRUZKA    v
        where v.stavka <> 0
        and  v.net is null ".$str."
        group by initcap(v.fio_prepod), v.divID
        union all
        select
           max(v.prepod_id) as ID,
           initcap(max(v.FIO) || ' (' || max(v.dol_small) || ')') || ' (' || max(v.stat) || ')'   as NAME,
           v.divID                    as DIVID,
           initcap(max(v.fio_prepod)) as FIO_FULL,
           initcapf(max(v.dol_small)) as JOB
        from V_SPI_PREPOD_NAGRUZKA    v
        where v.stavka = 0
        and  v.net is null ".$str."
        group by initcap(v.fio_prepod), v.divID
        order by FIO_FULL
        /*union
        select
           0            as ID,
           'Вакансия'   as NAME,
           0            as DIVID,
           'Вакансия'   as FIO_FULL,
           null         as JOB
        from dual*/
	";
//echo $query;
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