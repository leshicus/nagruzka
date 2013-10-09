<?
require_once("./../include.php");

try {
    $query = "
		select
           max(v.manid) as ID,
           initcap(max(v.FIO) || ' (' || max(v.dol_small) || ')')   as NAME,
           v.divID                    as DIVID,
           initcap(v.fio_prepod)      as FIO_FULL,
           initcapf(max(v.dol_small)) as JOB
        from V_SPI_PREPOD_NAGRUZKA    v
        where v.stavka <> 0
        and  v.net is null
        group by initcap(v.fio_prepod), v.divID
        union
        select
           max(v.manid) as ID,
           initcap(max(v.FIO) || ' (' || max(v.dol_small) || ')') || ' (' || max(v.stat) || ')'   as NAME,
           v.divID                    as DIVID,
           initcap(max(v.fio_prepod)) as FIO_FULL,
           initcapf(max(v.dol_small)) as JOB
        from V_SPI_PREPOD_NAGRUZKA    v
        where v.stavka = 0
        and  v.net is null
        group by initcap(v.fio_prepod), v.divID
        /*union
        select
           0            as ID,
           'Вакансия'   as NAME,
           0            as DIVID,
           'Вакансия'   as FIO_FULL,
           null         as JOB
        from dual*/
        order by Name
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