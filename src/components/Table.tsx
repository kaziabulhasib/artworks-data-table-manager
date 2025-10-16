import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { ProductService } from "../service/ProductService";

const Table = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ProductService.getProductsMini().then((data) => setProducts(data));
  }, []);
  return (
    <div>
      <DataTable value={products} tableStyle={{ minWidth: "50rem" }}>
        <Column field='code' header='Code'></Column>
        <Column field='name' header='Name'></Column>
        <Column field='category' header='Category'></Column>
        <Column field='quantity' header='Quantity'></Column>
      </DataTable>
    </div>
  );
};

export default Table;
