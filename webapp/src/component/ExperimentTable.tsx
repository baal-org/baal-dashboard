import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { type MRT_ColumnDef } from 'material-react-table';
import { ColumnFiltersState,SortingState } from '@tanstack/react-table';
import { useQuery } from "react-query";
import axios from "axios";
import ExperimentInterfaceFlat from "../interfaces/ExperimentInterfaceFlat";
import { useConfigurationContext } from "../context/Configuration";


export const ExperimentTable = () => {
    //data and fetching state
    const [isRefetching, setIsRefetching] = useState(false);
    const [rowCount, setRowCount] = useState(0);    
    const [rowSelection, setRowSelection] = useState({});
    //table state
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
    });
    // Context
    const { runIdArr, setRunIdArr } = useConfigurationContext();

    const { isLoading, isError, data, error, refetch } = useQuery({
          queryKey: [columnFilters,globalFilter,sorting,pagination],
          queryFn: () => axios.get("/experimentsflat").then((res) => res.data),
          enabled: true,
          refetchOnWindowFocus: false,
      });
    
    const maincols = useMemo<MRT_ColumnDef<ExperimentInterfaceFlat>[]>(
      () => [
              {
                header: 'Experiment ID',
                accessorKey: 'exp_id',  //simple accessorKey pointing to flat data
              },
              {
                header: 'Run ID',
                accessorKey: 'run_id', 
              }
          ],
      [],
      );

    useEffect(() => {
        const runIds = Array.from(new Set(Object.keys(rowSelection).map((key) => key.split('|')[1])));
        setRunIdArr(runIds)    
      }, [rowSelection]);

    

    if (isLoading) {
        return <p>Loading...</p>;
      }
    
    // Dynamically generate keys for hyperparameters
    const hyperParamKeys = Array.from(new Set(data.flatMap((exp:ExperimentInterfaceFlat) => Object.keys(exp.hparams))));
    
    const hyperparmcols: MRT_ColumnDef<ExperimentInterfaceFlat>[] = hyperParamKeys.map((key) => ({
        header: String(key),
        accessorKey: `hparams.${key}`,
      }));
          
    
    const columns = [...maincols, ...hyperparmcols]
  
    return (
    <div>
        <MaterialReactTable
            columns={columns}
            data={data}
            getRowId={(row) => String(row.exp_id) + "|" +String(row.run_id)}
            enablePinning
            enableRowSelection
            onRowSelectionChange={setRowSelection}
            initialState={
                { showColumnFilters: true,
                }
            
            }
            // manualFiltering
            // manualPagination
            // manualSorting
            muiTableBodyRowProps={({ row }) => ({

                //add onClick to row to select upon clicking anywhere in the row
        
                onClick: row.getToggleSelectedHandler(),
        
                sx: { cursor: 'pointer' },
        
            })}
            muiToolbarAlertBannerProps={
            isError
                ? {
                    color: 'error',
                    children: 'Error loading data',
                }
                : undefined
            }
            onColumnFiltersChange={setColumnFilters}
            onGlobalFilterChange={setGlobalFilter}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            rowCount={rowCount}
            state={{
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
            rowSelection
            }}
        />
    </div>
    );
};