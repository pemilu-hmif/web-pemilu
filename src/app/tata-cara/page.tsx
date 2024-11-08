import TataCaraList from "~/components/tatacara-list";

export default function TataCara() {
  return (
    <div className="mb-12 mt-32 flex flex-col items-center">
      <div className="container flex flex-col gap-16 p-4">
        {/* Title */}
        <div className="relative flex w-full flex-col items-center justify-center text-center text-white">
          <div className="relative flex gap-1">
            <h1 className="-rotate-12 font-sloop text-7xl sm:text-9xl">T</h1>
            <h1 className="font-playfair text-6xl sm:text-8xl">ata</h1>
            <h1 className="ml-2 -rotate-12 font-sloop text-7xl sm:text-9xl">
              C
            </h1>
            <h1 className="font-playfair text-6xl sm:text-8xl">ara</h1>
          </div>
          <h1 className="mt-2 font-neuething text-5xl font-bold tracking-wide sm:text-7xl">
            PEMILU HMIF ITB
          </h1>
        </div>
        {/* Tata Cara List */}
        <TataCaraList />
      </div>
    </div>
  );
}
