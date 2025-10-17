import { PrimeReactProvider } from "primereact/api";

import "primeicons/primeicons.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";

import "primeflex/primeflex.css";

import Table from "./components/Table";


function App() {
  return (
    <PrimeReactProvider>
      
      <Table />
    </PrimeReactProvider>
  );
}

export default App;
