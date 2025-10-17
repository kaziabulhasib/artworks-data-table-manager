import { PrimeReactProvider } from "primereact/api";

import "primeicons/primeicons.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";

import "primeflex/primeflex.css";

import Table from "./components/Table";
import OverlayPanelButton from "./components/OverlayPanelButton";

function App() {
  return (
    <PrimeReactProvider>
      <OverlayPanelButton />
      <Table />
    </PrimeReactProvider>
  );
}

export default App;
