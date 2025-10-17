
import { PrimeReactProvider } from "primereact/api";

import "primeicons/primeicons.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";

import "primeflex/primeflex.css";

import Table from "./components/Table";
// import "primereact/resources/themes/arya-blue/theme.css";

function App() {
  return (
    <PrimeReactProvider>
      <Table />
    </PrimeReactProvider>
  );
}

export default App;
