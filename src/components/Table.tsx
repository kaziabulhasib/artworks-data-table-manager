import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";

const Table = () => {
  // const url = "https://api.artic.edu/api/v1/artworks?page=1";

  const onPageChange = (event) => {
    setPage(event.page + 1);
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const columns = [
    { field: "title", header: "Title" },
    { field: "place_of_origin", header: "Place of Origin" },
    { field: "artist_display", header: "Artist Display" },
    { field: "inscriptions", header: "Inscriptions" },
    { field: "date_start", header: "Date Start" },
    { field: "date_end", header: "Date End" },
  ];

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${pageNumber}`
      );
      const data = await res.json();

      setProducts(data.data || []);
      setTotalRecords(data.pagination.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <div className='card'>
      <h1 className='text-center'>Data table</h1>

      {loading ? (
        <div className='card flex justify-content-center items-center  '>
          <ProgressSpinner />
        </div>
      ) : (
        <DataTable
          value={products}
          stripedRows
          paginator
          rows={12}
          totalRecords={totalRecords}
          lazy
          first={(page - 1) * 12}
          onPage={onPageChange}
          loading={loading}
          tableStyle={{ minWidth: "50rem" }}>
          {columns.map((col) => (
            <Column key={col.id} field={col.field} header={col.header} />
          ))}
        </DataTable>
      )}
    </div>
  );
};

export default Table;
