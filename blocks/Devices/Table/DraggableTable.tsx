import React, { useState, useMemo, useCallback } from 'react';
import { useTable } from 'react-table';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DraggableTable = ({ columns, data }: any) => {
  const [columnOrder, setColumnOrder] = useState(columns.map((col: any) => col.id));

  const reorderColumns = useCallback((draggedIndex: any, droppedIndex: any) => {
    const updatedOrder = [...columnOrder];
    const [removed] = updatedOrder.splice(draggedIndex, 1);
    updatedOrder.splice(droppedIndex, 0, removed);
    setColumnOrder(updatedOrder);
  }, [columnOrder]);

  const orderedColumns = useMemo(() => {
    return columnOrder.map((columnId: any) => columns.find((col: any) => col.id === columnId));
  }, [columnOrder, columns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns: orderedColumns,
    data,
  });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, index) => (
              <DraggableColumnHeader
                key={column.id}
                index={index}
                reorderColumns={reorderColumns}
                column={column}
              />
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const DraggableColumnHeader = ({ index, reorderColumns, column }: any) => {
  const [, drop] = useDrop({
    accept: 'column',
    hover: (draggedItem: any) => {
      if (draggedItem.index !== index) {
        reorderColumns(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'column',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <th
      {...column.getHeaderProps()}
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {column.render('Header')}
    </th>
  );
};

const columns = [
  {
    Header: 'Имя',
    accessor: 'name',
    id: 'name',
  },
  {
    Header: 'Возраст',
    accessor: 'age',
    id: 'age',
  },
  {
    Header: 'Город',
    accessor: 'city',
    id: 'city',
  },
];

const data = [
  { name: 'Иван', age: 30, city: 'Москва' },
  { name: 'Мария', age: 25, city: 'Санкт-Петербург' },
  { name: 'Алексей', age: 35, city: 'Новосибирск' },
];

const DraggableTables = () => (
  <DndProvider backend={HTML5Backend}>
    <div>
      <h1>Передвигаемые колонки</h1>
      <DraggableTable columns={columns} data={data} />
    </div>
  </DndProvider>
);

export default DraggableTables;
