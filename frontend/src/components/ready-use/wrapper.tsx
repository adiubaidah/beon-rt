import { useState } from "react";
import Sidebar from "~/components/ready-use/sidebar";
function Wrapper({ children }: { children: React.ReactNode }) {
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  return (
    <main className="flex h-full">
      <Sidebar
        toggled={toggled}
        setToggled={setToggled}
        setBroken={setBroken}
      />
      {broken && (
        <button
          className="fixed right-0 top-0"
          onClick={() => setToggled(!toggled)}
        >
          Buka
        </button>
      )}
      <section className="w-full overflow-y-scroll mt-4 container">
        {children}
      </section>
    </main>
  );
}

export default Wrapper;
