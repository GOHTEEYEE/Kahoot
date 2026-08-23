import { HomeAtmosphere } from "../components/home/HomeAtmosphere";
import { HomeClient } from "../components/HomeClient";

export default function HomePage() {
  return (
    <main className="home-page relative flex h-[100dvh] min-h-0 w-full flex-1 flex-col overflow-hidden">
      <HomeAtmosphere />
      <HomeClient />
    </main>
  );
}
