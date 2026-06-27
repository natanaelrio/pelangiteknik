function REKAP_LANGSUNG_VIDEO_MINGGUAN() {

  const sh = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("KONTEN VIDEO 2026");

  const lastRow = sh.getLastRow();

  const tanggalCol = sh.getRange(1, 1, lastRow, 1).getDisplayValues();
  const sosmedCol = sh.getRange(1, 2, lastRow, 1).getDisplayValues();
  const richText = sh.getRange(1, 3, lastRow, 9).getRichTextValues();

  const PIC = [
    "Dhita",
    "Azzah",
    "Ina",
    "Sifa",
    "Alma",
    "Ari",
    "Lia",
    "Maya",
    "Dina"
  ];

  const TARGET = 4;

  const hasil = [[
    "Periode",
    "Target",
    ...PIC,
    "Total Point PIC",
    "Persentase ( Total ÷ (Target × 9 PIC) × 100% )"
  ]];

  let tanggalAktif = "";

  const perHari = {};

  for (let r = 0; r < lastRow; r++) {

    if (tanggalCol[r][0] !== "") {
      tanggalAktif = tanggalCol[r][0].trim();
    }

    if (!tanggalAktif) continue;

    const sosmed = sosmedCol[r][0].toString().trim().toUpperCase();

    if (
      sosmed !== "TIKTOK" &&
      sosmed !== "IG" &&
      sosmed !== "YT SHORT"
    ) continue;

    if (!perHari[tanggalAktif]) {

      perHari[tanggalAktif] = Array(9)
        .fill(null)
        .map(() => ({
          tiktok: false,
          ig: false,
          yt: false
        }));
    }

    for (let c = 0; c < 9; c++) {

      let url = "";

      try {

        url =
          richText[r][c] &&
            richText[r][c].getLinkUrl()
            ? richText[r][c].getLinkUrl()
            : "";

      } catch (e) { }

      if (!url) continue;

      if (sosmed === "TIKTOK") {
        perHari[tanggalAktif][c].tiktok = true;
      }

      if (sosmed === "IG") {
        perHari[tanggalAktif][c].ig = true;
      }

      if (sosmed === "YT SHORT") {
        perHari[tanggalAktif][c].yt = true;
      }
    }
  }

  const semuaTanggal = Object.keys(perHari);

  const mingguList = [];
  let mingguAktif = [];

  semuaTanggal.forEach(tgl => {

    const hari = tgl.split(",")[0]
      .trim()
      .toLowerCase();

    if (hari === "senin") {

      if (mingguAktif.length > 0) {
        mingguList.push(mingguAktif);
      }

      mingguAktif = [tgl];

    } else {

      mingguAktif.push(tgl);

      if (hari === "sabtu") {

        mingguList.push(mingguAktif);
        mingguAktif = [];
      }
    }
  });

  if (mingguAktif.length > 0) {
    mingguList.push(mingguAktif);
  }

  mingguList.forEach(minggu => {

    const periode =
      minggu[0].replace(/^[^,]+,\s*/, "") +
      " - " +
      minggu[minggu.length - 1].replace(/^[^,]+,\s*/, "");

    const row = [
      periode,
      TARGET
    ];

    let totalPointMinggu = 0;
    const maxPointMinggu = TARGET * PIC.length;

    for (let pic = 0; pic < 9; pic++) {

      let point = 0;
      let asli = 0;

      minggu.forEach(tgl => {

        const data = perHari[tgl][pic];

        // ASLI: ada salah satu upload saja
        if (data.tiktok || data.ig || data.yt) {
          asli++;
        }

        // POINT: harus lengkap 3 platform
        if (data.tiktok && data.ig && data.yt) {
          point++;
        }

      });

      totalPointMinggu += point;

      const status = point >= TARGET ? "TRUE" : "FALSE";

      row.push(
        `${point} / ${asli} (${status})`
      );
    }

    const persentase =
      ((totalPointMinggu / maxPointMinggu) * 100).toFixed(1) + "%";

    row.push(totalPointMinggu);
    row.push(persentase);

    hasil.push(row);
  });

  return hasil;
}