import get from "lodash.get";
export interface IColumnType<T> {
    key: string;
    title: string;
    width?: number;
    render?: (column: IColumnType<T>, item: T) => void;
}

interface Props<T> {
    data: T[];
    columns: IColumnType<T>[];
}

export function Table<T>({ data, columns }: Props<T>): JSX.Element {
    return (
        <table className="border-none h-full w-full">
            <thead>
                <TableHeader columns={columns} />
            </thead>
            <tbody>
                <TableRow data={data} columns={columns} />
            </tbody>
        </table>
    );
}


interface TableHeaderProps<T> {
    columns: IColumnType<T>[];
}

export function TableHeader<T>({ columns }: TableHeaderProps<T>): JSX.Element {
    return (
        <tr>
            {columns.map((column, columnIndex) => (
                <th className="p-3 font-bold text-left text-lg sticky top-0 bg-slate-200"
                    key={`table-head-cell-${columnIndex}`}
                    style={{ width: column.width }}
                >
                    {column.title}
                </th>
            ))}
        </tr>
    );
}


interface TableRowProps<T> {
    data: T[];
    columns: IColumnType<T>[];
}

export function TableRow<T>({ data, columns }: TableRowProps<T>): JSX.Element {
    return (
        <>
            {data.map((item, itemIndex) => (
                <tr key={`table-body-${itemIndex}`} className="cursor-auto odd:bg-slate-300">
                    {columns.map((column, columnIndex) => (
                        <TableRowCell
                            key={`table-row-cell-${columnIndex}`}
                            item={item}
                            column={column}
                        />
                    ))}
                </tr>
            ))}
        </>
    );
}


interface TableRowCellProps<T> {
    item: T;
    column: IColumnType<T>;
}

export function TableRowCell<T>({ item, column }: TableRowCellProps<T>): JSX.Element {
    const value = get(item, column.key);
    return (
        <td>{column.render ? column.render(column, item) : value}</td>
    );
}