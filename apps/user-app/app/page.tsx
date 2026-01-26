import { LeftBar } from "../components/leftBar";
import { PhotoCompo } from "../components/photo";
import { Button } from "@repo/ui/button";
import { TopBar } from "../components/topBar";
import { Interact } from "../components/interact";
import { Photos } from "../components/allPhotos";
import CategoryFilter from "../components/CategoryFilter";

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* LEFT SIDEBAR */}
      <aside className="w-[88px] shrink-0 border-r">
        <LeftBar />
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex flex-col flex-1 overflow-hidden">

        {/* TOP BAR */}
        <header className="h-16 shrink-0 border-b">
          <TopBar />
        </header>
          <CategoryFilter/>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">

          {/* CENTER AREA */}
          <section className="flex flex-col flex-1 items-center overflow-hidden">

            {/* INTERACTION BAR */}
            {/* <div className="w-full shrink-0 border-b">
              <Interact />
            </div> */}

            {/* MAIN PHOTO */}
            <div className="flex-1 flex items-center justify-center overflow-auto">
             <Photos/>
            </div>

          </section>

          {/* RIGHT SIDEBAR */}
          <aside className="w-[260px] shrink-0 border-l p-2 flex flex-col gap-2 overflow-y-auto">
            <PhotoCompo />
            <PhotoCompo />
            <PhotoCompo />
            <PhotoCompo />
            <PhotoCompo />
            <PhotoCompo />

            <Button appName="Right" className="mt-2">
              More Images
            </Button>
          </aside>

        </div>
      </main>
    </div>
  );
}
