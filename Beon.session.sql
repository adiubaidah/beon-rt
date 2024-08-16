SELECT
    r.id,
    r.nomorRumah,
    r.alamat,
    p.nama as penghuni,
    pr.statusHunian,
    CASE
        WHEN ib.tanggalBayar IS NULL THEN false
        ELSE true
    END as isLunas
FROM
    rumah AS r
    LEFT JOIN penghuni_on_rumah pr ON r.id = pr.rumahId
    LEFT JOIN penghuni p ON pr.penghuniId = p.id
    LEFT JOIN (
        SELECT
            penghuniOnRumahId,
            MAX(tanggalBayar) as tanggalBayar
        FROM
            iuran_bulanan
        WHERE
            YEAR(tanggalBayar) >= YEAR(CURDATE())
            AND MONTH(tanggalBayar) >= MONTH(CURDATE())
        GROUP BY
            penghuniOnRumahId
    ) ib ON pr.id = ib.penghuniOnRumahId;


SELECT
    r.id as rumahId,
    r.nomorRumah,
    r.alamat,
    p.id as penghuniId,
    p.nama,
    pr.id as penghuniOnRumahId,
    pr.statusHunian,
    pr.mulai,
    pr.selesai,
    CASE
        WHEN pr.statusHunian = 'KONTRAK' THEN
            CASE
                WHEN NOT EXISTS (
                    SELECT 1
                    FROM jenis_iuran ji
                    LEFT JOIN iuran_bulanan ib ON ji.id = ib.jenisIuranId
                    AND ib.penghuniOnRumahId = pr.id
                    AND ib.tanggalBayar BETWEEN pr.mulai AND pr.selesai
                    AND ib.nominal > 0
                    WHERE ib.jenisIuranId IS NULL
                ) THEN 'Lunas'
                ELSE 'Belum Lunas'
            END
        WHEN pr.statusHunian = 'TETAP' THEN
            CASE
                WHEN NOT EXISTS (
                    SELECT 1
                    FROM jenis_iuran ji
                    LEFT JOIN iuran_bulanan ib ON ji.id = ib.jenisIuranId
                    AND ib.penghuniOnRumahId = pr.id
                    AND ib.tanggalBayar >= pr.mulai
                    AND ib.nominal > 0
                    WHERE ib.jenisIuranId IS NULL
                ) THEN 'Lunas'
                ELSE 'Belum Lunas'
            END
        ELSE 'N/A'
    END as isLunas
FROM
    rumah as r
    LEFT JOIN penghuni_on_rumah as pr ON r.id = pr.rumahId
    LEFT JOIN penghuni as p ON pr.penghuniId = p.id;