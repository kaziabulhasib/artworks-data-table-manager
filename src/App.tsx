import "./App.css";
import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";

import "primeicons/primeicons.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import Table from "./components/Table";
// import "primereact/resources/themes/arya-blue/theme.css";

function App() {
  return (
    <PrimeReactProvider>
      <Button label='Check' icon='pi pi-check' />
      <Table />
    </PrimeReactProvider>
  );
}

export default App;
