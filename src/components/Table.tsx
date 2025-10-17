import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";

import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface ColumnType {
  field: keyof Artwork;
  header: string;
}

const Table = () => {
  // const url = "https://api.artic.edu/api/v1/artworks?page=1";

  const onPageChange = (event: DataTablePageEvent) => {
    if (event.page !== undefined) {
      setPage(event.page + 1);
    }
  };

  const [products, setProducts] = useState<Artwork[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Artworks[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const columns: ColumnType[] = [
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
        <>
          {/* check box  */}

          <DataTable
            value={products}
            selectionMode='multiple'
            selection={selectedProducts!}
            onSelectionChange={(e) => setSelectedProducts(e.value)}
            scrollable
            stripedRows
            paginator
            rows={12}
            totalRecords={totalRecords}
            lazy
            first={(page - 1) * 12}
            onPage={onPageChange}
            loading={loading}
            tableStyle={{ minWidth: "55rem" }}>
            <Column selectionMode='multiple' headerStyle={{ width: "3rem" }} />
            {/* overlay panel */}

            {columns.map((col) => (
              <Column key={col.field} field={col.field} header={col.header} />
            ))}
          </DataTable>
        </>
      )}
    </div>
  );
};

export default Table;
