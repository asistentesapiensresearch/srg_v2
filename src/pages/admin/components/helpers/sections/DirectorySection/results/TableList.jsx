// src/view/sections/DirectorySection/results/TableList.jsx
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { visuallyHidden } from '@mui/utils';

// --- HELPERS DE ORDENAMIENTO ---
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// --- ROW COMPONENT ---
function Row(props) {
    const { row, columns, aliases } = props;
    const [open, setOpen] = React.useState(false);

    // Verificamos si existe historial para habilitar el botón de expandir
    const hasHistory = row.history && row.history.length > 0;

    return (
        <React.Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell width={50}>
                    {hasHistory ? (
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    ) : (
                        <Box sx={{ width: 24 }} />
                    )}
                </TableCell>
                {columns.map((colKey) => (
                    <TableCell key={colKey} component="th" scope="row">
                        {typeof row[colKey] === 'object'
                            ? JSON.stringify(row[colKey])
                            : row[colKey] || '-'}
                    </TableCell>
                ))}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 1}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, bgcolor: '#f8f9fa', p: 2, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <Typography variant="subtitle2" gutterBottom component="div" color="primary" fontWeight="bold">
                                Historial y otros años
                            </Typography>
                            
                            {/* TABLA DE HISTORIAL */}
                            <Table size="small" aria-label="history">
                                <TableHead>
                                    <TableRow>
                                        {/* Usamos los mismos encabezados (Aliases) para consistencia */}
                                        {columns.map((colKey) => (
                                            <TableCell key={colKey} sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#666' }}>
                                                {aliases[colKey] || colKey}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.history && row.history.map((historyRow, index) => (
                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            {columns.map((colKey) => (
                                                <TableCell key={colKey} component="th" scope="row" sx={{ fontSize: '0.8rem' }}>
                                                    {typeof historyRow[colKey] === 'object'
                                                        ? JSON.stringify(historyRow[colKey])
                                                        : historyRow[colKey] || '-'}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    aliases: PropTypes.object,
};

// --- TABLELIST COMPONENT ---
export default function TableList({ data = [], columns = [], aliases = {} }) {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const displayColumns = columns.length > 0
        ? columns
        : (data.length > 0 ? Object.keys(data[0]).slice(0, 5) : []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (data.length === 0) {
        return <Typography p={4} textAlign="center">No hay datos para mostrar en la tabla.</Typography>;
    }

    const visibleRows = React.useMemo(
        () =>
            stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [data, order, orderBy, page, rowsPerPage],
    );

    return (
        <Paper elevation={0} variant="outlined" sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <TableContainer>
                <Table aria-label="collapsible table">
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell />
                            {displayColumns.map((colKey) => (
                                <TableCell
                                    key={colKey}
                                    sortDirection={orderBy === colKey ? order : false}
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    <TableSortLabel
                                        active={orderBy === colKey}
                                        direction={orderBy === colKey ? order : 'asc'}
                                        onClick={createSortHandler(colKey)}
                                    >
                                        {aliases[colKey] || colKey}
                                        {orderBy === colKey ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map((row, index) => (
                            <Row 
                                key={row._id || index} 
                                row={row} 
                                columns={displayColumns} 
                                aliases={aliases} 
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas"
            />
        </Paper>
    );
}