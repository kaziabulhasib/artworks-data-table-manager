import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const Table = () => {
  const url = "https://api.artic.edu/api/v1/artworks?page=1";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "title", header: "Title" },
    { field: "place_of_origin", header: "Place of Origin" },
    { field: "artist_display", header: "Artist Display" },
    { field: "inscriptions", header: "Inscriptions" },
    { field: "date_start", header: "Date Start" },
    { field: "date_end", header: "Date End" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.data || []);
        console.log("Fetched data:", data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className='card'>
      <h1 className='text-center'>Data table</h1>

      {loading ? (
        <div className='card flex justify-content-center items-center  '>
          <ProgressSpinner />
        </div>
      ) : (
        <DataTable value={products} tableStyle={{ minWidth: "50rem" }}>
          {columns.map((col) => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}
        </DataTable>
      )}
    </div>
  );
};

export default Table;
