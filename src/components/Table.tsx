import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";

const Table = () => {
  const url = "https://api.artic.edu/api/v1/artworks?page=1";
  const [products, setProducts] = useState([]);

  const columns = [
    { field: "title", header: "Title" },
    { field: "place_of_origin", header: "Place of Origin" },
    { field: "artist_display", header: "Artist Display" },
    { field: "inscriptions", header: "Inscriptions" },
    { field: "date_start", header: "Date Start" },
    { field: "date_end", header: "Date End" },
  ];

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data);
        console.log(data.data);
      });
  }, [products]);
  return (
    <div>
      <h1>Data table</h1>

      <DataTable value={products} tableStyle={{ minWidth: "50rem" }}>
        {columns.map((col) => (
          <Column key={col.field} field={col.field} header={col.header} />
        ))}
      </DataTable>
    </div>
  );
};

export default Table;
