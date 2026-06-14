import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Rating from "@mui/material/Rating";
import { visuallyHidden } from "@mui/utils";

const RECOGNITIONS_COLUMN = "__reconocimientos";
const RECOGNITIONS_COLUMN_WIDTH = 360;

// --- HELPERS DE ORDENAMIENTO ---
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
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

const cleanString = (val) => {
  if (val === null || val === undefined) return "";
  return String(val)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9+]/g, "")
    .trim();
};

const isLinkedValue = (value) => {
  if (value === true) return true;
  if (value === false || value === null || value === undefined) return false;

  return ["si", "true", "1", "yes"].includes(cleanString(value));
};

const isCategoryColumn = (columnName) => cleanString(columnName).includes("categoria");

const isQualificationColumn = (columnName) => cleanString(columnName).includes("calificacion");

const isAccreditationColumn = (columnName) =>
  cleanString(columnName).includes("acreditacion");

const isCertificationColumn = (columnName) =>
  cleanString(columnName).includes("certificacion");

const isRecognitionSourceColumn = (columnName) =>
  isCertificationColumn(columnName) || isAccreditationColumn(columnName);

const getFirstColumnValue = (row, predicate) => {
  const key = Object.keys(row || {}).find(predicate);
  return key ? row[key] : "";
};

const mergeRecognitionColumns = (cols, options = {}) => {
  const { hideYear = false } = options;
  const filteredCols = hideYear
    ? (cols || []).filter((col) => col !== "Año")
    : (cols || []);
  const firstRecognitionIndex = filteredCols.findIndex(isRecognitionSourceColumn);

  if (firstRecognitionIndex === -1) return filteredCols;

  const result = [];
  filteredCols.forEach((col, index) => {
    if (index === firstRecognitionIndex) {
      result.push(RECOGNITIONS_COLUMN);
    }

    if (!isRecognitionSourceColumn(col)) {
      result.push(col);
    }
  });

  return result;
};

const renderCategory = (value) => {
  if (!value) return "-";

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 34,
        px: 1.25,
        py: 0.5,
        borderRadius: "999px",
        border: "1px solid rgb(254, 202, 202)",
        backgroundColor: "rgb(254, 242, 242)",
        color: "rgb(153, 27, 27)",
        fontSize: "0.75rem",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {String(value).trim().toLowerCase().startsWith("d") ? value : `D${value}`}
    </Box>
  );
};

const renderBadges = (value, tone = "red", fullWidth = false, columns = 1) => {
  if (!value) return "-";

  const items = String(value)
    .split("+")
    .map((item) => item.trim())
    .filter(Boolean);

  const badgeSx =
    tone === "blue"
      ? {
          border: "1px solid rgb(191, 219, 254)",
          backgroundColor: "rgb(239, 246, 255)",
          color: "rgb(29, 78, 216)",
        }
      : tone === "yellow"
        ? {
            border: "1px solid rgb(253, 230, 138)",
            backgroundColor: "rgb(254, 252, 232)",
            color: "rgb(161, 98, 7)",
          }
      : {
          border: "1px solid rgb(254, 202, 202)",
          backgroundColor: "rgb(254, 242, 242)",
          color: "rgb(153, 27, 27)",
        };

  return (
    <Box
      sx={{
        display: columns > 1 ? "grid" : "flex",
        gridTemplateColumns: columns > 1 ? `repeat(${columns}, minmax(0, 1fr))` : undefined,
        flexDirection: columns > 1 ? undefined : "column",
        alignItems: columns > 1 ? undefined : fullWidth ? "stretch" : "flex-start",
        gap: 0.75,
        width: fullWidth ? "100%" : "auto",
      }}
    >
      {items.map((item, index) => (
        <Box
          key={index}
          component="span"
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: "999px",
            ...badgeSx,
            fontSize: "0.75rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
            width: fullWidth ? "100%" : "auto",
            textAlign: fullWidth ? "center" : "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item}
        </Box>
      ))}
    </Box>
  );
};

const renderCellValue = (row, colKey, aliases = {}) => {
  if (colKey === RECOGNITIONS_COLUMN) {
    const certificationValue = getFirstColumnValue(row, isCertificationColumn);
    const accreditationValue = getFirstColumnValue(row, isAccreditationColumn);

    if (!certificationValue && !accreditationValue) return "-";

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0.75,
          minWidth: RECOGNITIONS_COLUMN_WIDTH - 80,
          width: "100%",
        }}
      >
        {certificationValue ? renderBadges(certificationValue, "red", true, 3) : null}
        {accreditationValue ? renderBadges(accreditationValue, "blue", true, 3) : null}
      </Box>
    );
  }

  if (colKey === "Star") {
    return row[colKey] ? (
      <Rating value={Number(row[colKey])} readOnly size="small" />
    ) : (
      "-"
    );
  }

  if (isCategoryColumn(colKey) || isCategoryColumn(aliases[colKey])) {
    return renderCategory(row[colKey] ?? getFirstColumnValue(row, isCategoryColumn));
  }

  if (isQualificationColumn(colKey) || isQualificationColumn(aliases[colKey])) {
    return renderBadges(row[colKey] ?? getFirstColumnValue(row, isQualificationColumn), "yellow");
  }

  if (isAccreditationColumn(colKey)) {
    return renderBadges(row[colKey], "blue");
  }

  if (isCertificationColumn(colKey)) {
    return renderBadges(row[colKey]);
  }

  if (typeof row[colKey] === "object") {
    return JSON.stringify(row[colKey]);
  }

  return row[colKey] || "-";
};

// --- ROW COMPONENT ---
function Row(props) {
  const {
    row,
    columns,
    historyColumns,
    aliases,
    rowIndex
  } = props;
  const [open, setOpen] = React.useState(false);

  // Verificamos si existe historial para habilitar el botón de expandir
  const hasHistory = row.history && row.history.length > 0;
  const isLinked = isLinkedValue(row.isLinked) || isLinkedValue(row.Vinculada);
  const displayHistoryColumns = React.useMemo(() => {
    return mergeRecognitionColumns(historyColumns || []);
  }, [historyColumns]);
    
  return (
    <React.Fragment>
      <TableRow
        hover
        sx={{
          backgroundColor: rowIndex % 2 === 0 ? "#ffffff" : "#f5f5f5",
          "& > *": { borderBottom: "unset" },
        }}
      >
        <TableCell width={50}>
          {hasHistory && isLinked ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#dc2626",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#b91c1c",
                },
              }}
            >
              {open ? (
                <RemoveIcon fontSize="small" />
              ) : (
                <AddIcon fontSize="small" />
              )}
            </IconButton>
          ) : (
            <Box sx={{ width: 32 }} />
          )}
        </TableCell>
        {columns.map((colKey) => (
          <TableCell
            key={colKey}
            component="th"
            scope="row"
            sx={{
              color: !hasHistory ? "#9ca3af" : "inherit",
              width: colKey === RECOGNITIONS_COLUMN ? RECOGNITIONS_COLUMN_WIDTH : "auto",
              minWidth: colKey === RECOGNITIONS_COLUMN ? RECOGNITIONS_COLUMN_WIDTH : "auto",
            }}
          >
            {renderCellValue(row, colKey, aliases)}
          </TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={columns.length + 1}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 2,
                bgcolor: "#f8f9fa",
                p: 2,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="subtitle2"
                gutterBottom
                component="div"
                color="primary"
                fontWeight="bold"
              >
                Historial
              </Typography>

              {/* TABLA DE HISTORIAL */}
              <Table size="small" aria-label="history">
                <TableHead>
                  <TableRow>
                    {displayHistoryColumns.map((colKey) => (
                      <TableCell
                        key={colKey}
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          color: "#666",
                          width: colKey === RECOGNITIONS_COLUMN ? RECOGNITIONS_COLUMN_WIDTH : "auto",
                          minWidth: colKey === RECOGNITIONS_COLUMN ? RECOGNITIONS_COLUMN_WIDTH : "auto",
                        }}
                      >
                        {colKey === RECOGNITIONS_COLUMN ? "Reconocimientos" : aliases[colKey] || colKey}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history &&
                    row.history.map((historyRow, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor:
                            index % 2 === 0 ? "#ffffff" : "#f5f5f5",
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {displayHistoryColumns.map((colKey) => (
                          <TableCell
                            key={colKey}
                            component="th"
                            scope="row"
                            sx={{
                              fontSize: "0.8rem",
                              width: colKey === RECOGNITIONS_COLUMN ? RECOGNITIONS_COLUMN_WIDTH : "auto",
                              minWidth: colKey === RECOGNITIONS_COLUMN ? RECOGNITIONS_COLUMN_WIDTH : "auto",
                            }}
                          >
                            {renderCellValue(historyRow, colKey, aliases)}
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
export default function TableList({ data = [], columns = [], historyColumns = [], aliases = {} }) {
  // ========================================================================
  // 1. TODOS LOS ESTADOS (HOOKS) PRIMERO
  // ========================================================================
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // ========================================================================
  // 2. TODOS LOS MEMOS (DESPUÉS DE ESTADOS, ANTES DE HANDLERS)
  // ========================================================================

  // Memo: Columnas a mostrar
  const displayColumns = React.useMemo(() => {
    const cols =
      columns.length > 0
        ? columns
        : data.length > 0
          ? Object.keys(data[0]).slice(0, 5)
          : [];

    return mergeRecognitionColumns(cols, { hideYear: true });
  }, [columns, data]);

  // Memo: Filas visibles (ordenadas y paginadas)
  const visibleRows = React.useMemo(() => {
    if (data.length === 0) return [];

    return stableSort(data, getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage,
    );
  }, [data, order, orderBy, page, rowsPerPage]);

  // ========================================================================
  // 3. HANDLERS (DESPUÉS DE MEMOS, ANTES DE RENDER)
  // ========================================================================

  const handleRequestSort = React.useCallback(
    (event, property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    [order, orderBy],
  );

  const createSortHandler = React.useCallback(
    (property) => (event) => {
      handleRequestSort(event, property);
    },
    [handleRequestSort],
  );

  const handleChangePage = React.useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = React.useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // ========================================================================
  // 4. RENDER (AL FINAL, CON CONDICIONAL SI ES NECESARIO)
  // ========================================================================

  // Return condicional para data vacía
  if (data.length === 0) {
    return (
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 4, p: 4 }}>
        <Typography textAlign="center" color="text.secondary">
          No hay datos para mostrar en la tabla.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ borderRadius: 4, overflow: "hidden" }}
    >
      <TableContainer>
        <Table aria-label="collapsible table">
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell />
              {displayColumns.map((colKey) => (
                <TableCell
                  key={colKey}
                  sortDirection={orderBy === colKey ? order : false}
                  sx={{
                    fontWeight: "bold",
                    width: colKey === RECOGNITIONS_COLUMN ? RECOGNITIONS_COLUMN_WIDTH : "auto",
                    minWidth: colKey === RECOGNITIONS_COLUMN ? RECOGNITIONS_COLUMN_WIDTH : "auto",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === colKey}
                    direction={orderBy === colKey ? order : "asc"}
                    onClick={createSortHandler(colKey)}
                  >
                    {colKey === RECOGNITIONS_COLUMN ? "Reconocimientos" : aliases[colKey] || colKey}
                    {orderBy === colKey ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
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
                rowIndex={index}
                columns={displayColumns}
                historyColumns={historyColumns}
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
