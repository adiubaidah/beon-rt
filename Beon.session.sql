WITH RECURSIVE months AS (
    SELECT
        pr.id AS penghuniId,
        pr.mulai AS month_start,
        pr.selesai
    FROM
        penghuni_on_rumah pr
    UNION
    ALL
    SELECT
        penghuniId,
        DATE_ADD(month_start, INTERVAL 1 MONTH),
        selesai
    FROM
        months
    WHERE
        DATE_ADD(month_start, INTERVAL 1 MONTH) <= selesai
)
SELECT
    r.id as rumahId,
    r.nomorRumah,
    r.alamat,
    p.id as penghuniId,
    p.nama as namaPenghuni,
    p.noTelepon,
    pr.id,
    pr.statusHunian,
    pr.mulai,
    pr.selesai,
    CASE
        WHEN pr.statusHunian = 'KONTRAK'
        OR pr.statusHunian = 'TETAP' THEN CASE
            WHEN NOT EXISTS (
                SELECT
                    1
                FROM
                    months m
                    LEFT JOIN iuran_bulanan ib ON m.penghuniId = ib.penghuniOnRumahId
                    AND YEAR(ib.tanggalBayar) = YEAR(m.month_start)
                    AND MONTH(ib.tanggalBayar) = MONTH(m.month_start)
                    AND ib.nominal > 0
                WHERE
                    ib.penghuniOnRumahId IS NULL
            ) THEN 1
            ELSE 0
        END
        ELSE 'N/A'
    END as isLunas
FROM
    rumah as r
    LEFT JOIN penghuni_on_rumah as pr ON r.id = pr.rumahId
    LEFT JOIN penghuni as p ON pr.penghuniId = p.id;