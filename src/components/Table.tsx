import { Column } from "primereact/column";
import {
  DataTable,
  type DataTablePageEvent,
  type DataTableSelectionMultipleChangeEvent,
} from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useRef, useState } from "react";
import OverlayPanelButton from "./OverlayPanelButton";

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
  const [products, setProducts] = useState<Artwork[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [metaKey, setMetaKey] = useState<boolean>(true);
  const [pendingSelection, setPendingSelection] = useState<{
    totalNeeded: number;
    currentlySelected: Artwork[];
    startPage: number;
  } | null>(null);

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

  //

  const pendingSelectionRef = useRef<typeof pendingSelection>(pendingSelection);

  useEffect(() => {
    pendingSelectionRef.current = pendingSelection;
  }, [pendingSelection]);

  useEffect(() => {
    const ps = pendingSelectionRef.current;

    if (!ps || products.length === 0 || loading) return;

    const alreadySelected = ps.currentlySelected.length;
    const stillNeeded = ps.totalNeeded - alreadySelected;

    if (stillNeeded <= 0) {
      setPendingSelection(null);
      return;
    }

    const rowsToSelectFromCurrentPage = Math.min(stillNeeded, products.length);
    const newSelections = products.slice(0, rowsToSelectFromCurrentPage);

    const uniqueSelections = [
      ...new Map(
        [...ps.currentlySelected, ...newSelections].map((item) => [
          item.id,
          item,
        ])
      ).values(),
    ];

    const sameLength = uniqueSelections.length === ps.currentlySelected.length;
    const sameIds =
      sameLength &&
      uniqueSelections.every(
        (it, idx) => it.id === ps.currentlySelected[idx]?.id
      );

    if (!sameIds) {
      setSelectedProducts(uniqueSelections);
    }

    if (uniqueSelections.length < ps.totalNeeded) {
      const nextPending: NonNullable<typeof pendingSelection> = {
        totalNeeded: ps.totalNeeded,
        currentlySelected: uniqueSelections,
        startPage: ps.startPage,
      };

      const changed =
        JSON.stringify(nextPending.currentlySelected.map((s) => s.id)) !==
        JSON.stringify(ps.currentlySelected.map((s) => s.id));

      if (changed) {
        setPendingSelection(nextPending);
      }

      requestAnimationFrame(() => {
        setPage((p) => p + 1);
      });
    } else {
      setPendingSelection(null);
    }
  }, [products, loading]);

  const handleRowSelection = (numRows: number) => {
    const rowsFromCurrentPage = Math.min(numRows, products.length);
    const currentPageSelections = products.slice(0, rowsFromCurrentPage);
    setSelectedProducts(currentPageSelections);

    if (numRows > rowsFromCurrentPage) {
      setPendingSelection({
        totalNeeded: numRows,
        currentlySelected: currentPageSelections,
        startPage: page,
      });

      setTimeout(() => {
        setPage((prev) => prev + 1);
      }, 50);
    } else {
      setPendingSelection(null);
    }
  };

  const onPageChange = (event: DataTablePageEvent) => {
    if (event.page !== undefined && !pendingSelection) {
      setPage(event.page + 1);
      setSelectedProducts([]);
    }
  };

  const handleSelectionChange = (
    e: DataTableSelectionMultipleChangeEvent<Artwork[]>
  ) => {
    if (!pendingSelection) {
      setSelectedProducts(e.value);
    }
  };

  return (
    <div className='card'>
      <h1 className='text-center'>Data table</h1>

      {loading ? (
        <div className='card flex justify-content-center items-center'>
          <ProgressSpinner />
        </div>
      ) : (
        <>
          <OverlayPanelButton onSubmit={handleRowSelection} />

          <DataTable
            value={products}
            dataKey='id'
            selectionMode='multiple'
            metaKeySelection={metaKey}
            selection={selectedProducts}
            onSelectionChange={handleSelectionChange}
            dragSelection
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
