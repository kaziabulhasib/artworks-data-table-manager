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
  const [allSelections, setAllSelections] = useState<Record<number, Artwork>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [metaKey, setMetaKey] = useState<boolean>(true);

//  bulk selection 
  const [pendingSelection, setPendingSelection] = useState<{
    totalNeeded: number;
    currentlySelected: Artwork[];
    startPage: number;
  } | null>(null);
  const pendingSelectionRef = useRef<typeof pendingSelection>(pendingSelection);

  useEffect(() => {
    pendingSelectionRef.current = pendingSelection;
  }, [pendingSelection]);

  const columns: ColumnType[] = [
    { field: "title", header: "Title" },
    { field: "place_of_origin", header: "Place of Origin" },
    { field: "artist_display", header: "Artist Display" },
    { field: "inscriptions", header: "Inscriptions" },
    { field: "date_start", header: "Date Start" },
    { field: "date_end", header: "Date End" },
  ];

  // Fetch paginated data
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

  //  persisted selectons 
  useEffect(() => {
    if (products.length === 0) return;
    const selectedOnPage = products.filter((p) => allSelections[p.id]);
    setSelectedProducts(selectedOnPage);
  }, [products, allSelections]);

  
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

    const updatedMap = { ...allSelections };
    uniqueSelections.forEach((item) => (updatedMap[item.id] = item));
    setAllSelections(updatedMap);

    setSelectedProducts(products.filter((p) => updatedMap[p.id]));

    if (uniqueSelections.length < ps.totalNeeded) {
      const nextPending = {
        totalNeeded: ps.totalNeeded,
        currentlySelected: uniqueSelections,
        startPage: ps.startPage,
      };
      setPendingSelection(nextPending);
      requestAnimationFrame(() => setPage((p) => p + 1));
    } else {
      setPendingSelection(null);
    }
  }, [products, loading]);

  // Manual multi-row selection
  const handleRowSelection = (numRows: number) => {
    const rowsFromCurrentPage = Math.min(numRows, products.length);
    const currentPageSelections = products.slice(0, rowsFromCurrentPage);

    const updatedMap = { ...allSelections };
    currentPageSelections.forEach((item) => (updatedMap[item.id] = item));
    setAllSelections(updatedMap);
    setSelectedProducts(currentPageSelections);

    if (numRows > rowsFromCurrentPage) {
      setPendingSelection({
        totalNeeded: numRows,
        currentlySelected: currentPageSelections,
        startPage: page,
      });
      setTimeout(() => setPage((prev) => prev + 1), 50);
    } else {
      setPendingSelection(null);
    }
  };

  // Pagination change handler
  const onPageChange = (event: DataTablePageEvent) => {
    if (event.page !== undefined && !pendingSelection) {
      setPage(event.page + 1);
    }
  };

  // Row selection change persistence
  const handleSelectionChange = (
    e: DataTableSelectionMultipleChangeEvent<Artwork[]>
  ) => {
    if (pendingSelection) return;

    const newSelection = e.value;
    const updatedMap = { ...allSelections };

    // Add selected
    newSelection.forEach((item) => (updatedMap[item.id] = item));

    // Remove unselected
    products.forEach((item) => {
      if (!newSelection.find((sel) => sel.id === item.id)) {
        delete updatedMap[item.id];
      }
    });

    setAllSelections(updatedMap);
    setSelectedProducts(newSelection);
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
