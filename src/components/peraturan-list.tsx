import React from "react";
import Collapsible from "./collapsible";
import MdxWrapper from "~/components/MDXProvider";

import P1 from "~/data/peraturan/1.mdx";
import P2 from "~/data/peraturan/2.mdx";
import P3 from "~/data/peraturan/3.mdx";
import P4 from "~/data/peraturan/4.mdx";
import P5 from "~/data/peraturan/5.mdx";
import P6 from "~/data/peraturan/6.mdx";
import P7 from "~/data/peraturan/7.mdx";
import P8 from "~/data/peraturan/8.mdx";

export default function PeraturanList() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">

      <Collapsible title="Bagian I Definisi dan Penjelasan Umum" logotype="book">
        <MdxWrapper>
          <P1 />
        </MdxWrapper>
      </Collapsible>

      <Collapsible title="Bagian II Definisi Pemilihan Umum (Pemilu) HMIF ITB" logotype="book">
        <MdxWrapper>
          <P2 />
        </MdxWrapper>
      </Collapsible>

      <Collapsible title="Bagian III Prasyarat untuk menjadi calon ketua HMIF" logotype="checkbox">
        <MdxWrapper>
          <P3 />
        </MdxWrapper>
      </Collapsible>

      <Collapsible title="Bagian IV Prasyarat untuk menjadi calon senator HMIF" logotype="checkbox">
        <MdxWrapper>
          <P4 />
        </MdxWrapper>
      </Collapsible>

      <Collapsible title="Bagian V Ketentuan untuk menjadi tim sukses calon ketua HMIF atau calon senator HMIF" logotype="rule">
        <MdxWrapper>
          <P5 />
        </MdxWrapper>
      </Collapsible>

      <Collapsible title="Bagian VI Ketentuan Daftar Pemilih Tetap" logotype="rule">
        <MdxWrapper>
          <P6 />
        </MdxWrapper>
      </Collapsible>

      <Collapsible title="Bagian VII Rangkaian Acara" logotype="calendar">
        <MdxWrapper>
          <P7 />
        </MdxWrapper>
      </Collapsible>

      <Collapsible title="Bagian VIII Aturan Tambahan" logotype="exclamation">
        <MdxWrapper>
          <P8 />
        </MdxWrapper>
      </Collapsible>

    </div>
  );
}

