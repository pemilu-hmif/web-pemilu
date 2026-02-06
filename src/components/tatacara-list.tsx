import Collapsible from "./collapsible";

import Bagian1 from "~/data/tata-cara/1.mdx";
import Bagian2 from "~/data/tata-cara/2.mdx";
import Bagian3 from "~/data/tata-cara/3.mdx";
import Bagian4 from "~/data/tata-cara/4.mdx";
import Bagian5 from "~/data/tata-cara/5.mdx";
import Bagian6 from "~/data/tata-cara/6.mdx";
import Bagian7 from "~/data/tata-cara/7.mdx";

export default function TataCaraList() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Collapsible title="Bagian I Pendaftaran" logotype="addPerson">
        <Bagian1 />
      </Collapsible>

      <Collapsible
        title="Bagian II Pengembalian Berkas, Verifikasi, dan Pengumuman Calon Terpilih"
        logotype="clipboard"
      >
        <Bagian2 />
      </Collapsible>

      <Collapsible title="Bagian III Kampanye" logotype="announcement">
        <Bagian3 />
      </Collapsible>

      <Collapsible title="Bagian IV Debat dan Uji Publik" logotype="public">
        <Bagian4 />
      </Collapsible>

      <Collapsible title="Bagian V Pemungutan Suara" logotype="vote">
        <Bagian5 />
      </Collapsible>

      <Collapsible title="Bagian VI Perhitungan Suara" logotype="addVote">
        <Bagian6 />
      </Collapsible>

      <Collapsible title="Bagian VII Pelanggaran" logotype="violation">
        <Bagian7 />
      </Collapsible>
    </div>
  );
}
