SELECT
    r.id,
    r.nomorRumah,
    r.alamat,
    p.nama as namaPenghuni,
    pr.statusHunian,
    pr.menghuni
FROM
    rumah AS r
    LEFT JOIN (
        SELECT
            *
        FROM
            penghuni_on_rumah
        WHERE
            (rumahId, mulai) IN (
                SELECT
                    rumahId,
                    MAX(mulai)
                FROM
                    penghuni_on_rumah
                GROUP BY
                    rumahId
            )
    ) as pr ON r.id = pr.rumahId
    LEFT JOIN penghuni as p ON pr.penghuniId = p.id;