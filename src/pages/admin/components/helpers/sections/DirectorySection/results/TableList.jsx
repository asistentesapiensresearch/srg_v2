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
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import Rating from "@mui/material/Rating";
import { visuallyHidden } from "@mui/utils";

const RECOGNITIONS_COLUMN = "__reconocimientos";
const LOCATION_COLUMN = "__ubicacion";
const RECOGNITIONS_COLUMN_WIDTH = 280;

const getRecognitionColumnSx = () => ({
  width: { xs: 160, sm: 220, md: RECOGNITIONS_COLUMN_WIDTH },
  maxWidth: { xs: 160, sm: 220, md: RECOGNITIONS_COLUMN_WIDTH },
});

const getTableCellSx = (colKey) => ({
  ...(colKey === RECOGNITIONS_COLUMN ? getRecognitionColumnSx() : {}),
  maxWidth: colKey === RECOGNITIONS_COLUMN ? undefined : { xs: 96, sm: 130, md: 170 },
  px: { xs: 0.75, sm: 1.25 },
  py: 1,
  textAlign: isSchoolNameColumn(colKey) ? "left" : "center",
  verticalAlign: "middle",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  "& > .MuiBox-root": {
    marginLeft: isSchoolNameColumn(colKey) ? 0 : "auto",
    marginRight: isSchoolNameColumn(colKey) ? 0 : "auto",
    alignItems: "center",
  },
});

// --- HELPERS DE ORDENAMIENTO ---
const getSortValue = (row, orderBy) => {
  if (orderBy === LOCATION_COLUMN) return getLocationValue(row);
  return row?.[orderBy];
};

function descendingComparator(a, b, orderBy) {
  const valueA = getSortValue(a, orderBy);
  const valueB = getSortValue(b, orderBy);

  if (valueB < valueA) return -1;
  if (valueB > valueA) return 1;
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

const isSchoolNameColumn = (columnName) => {
  const normalized = cleanString(columnName);
  return ["colegios", "colegio", "nombre"].includes(normalized);
};

const cleanSchoolName = (value) => String(value || "").replace(/^\++\s*/, "");

const isCityColumn = (columnName) => cleanString(columnName).includes("ciudad");

const isDepartmentColumn = (columnName) => cleanString(columnName).includes("departamento");

const isClassificationColumn = (columnName, aliases = {}) =>
  isCategoryColumn(columnName) ||
  isCategoryColumn(aliases[columnName]) ||
  isQualificationColumn(columnName) ||
  isQualificationColumn(aliases[columnName]);

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

const getLocationValue = (row) => {
  const city = row?.Ciudad ?? getFirstColumnValue(row, isCityColumn);
  const department = row?.Departamento ?? getFirstColumnValue(row, isDepartmentColumn);

  return [city, department]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .join(", ");
};

const getColumnLabel = (colKey, aliases = {}) => {
  if (colKey === RECOGNITIONS_COLUMN) return aliases[RECOGNITIONS_COLUMN] || "Respaldos";
  if (colKey === LOCATION_COLUMN) return "Ubicación";
  return aliases[colKey] || colKey;
};

const mergeLocationColumns = (cols) => {
  const hasCity = (cols || []).some(isCityColumn);
  const hasDepartment = (cols || []).some(isDepartmentColumn);

  if (!hasCity && !hasDepartment) return cols || [];

  let locationInserted = false;

  return (cols || []).reduce((result, col) => {
    if (isCityColumn(col) || isDepartmentColumn(col)) {
      if (!locationInserted) {
        result.push(LOCATION_COLUMN);
        locationInserted = true;
      }
      return result;
    }

    result.push(col);
    return result;
  }, []);
};

const mergeRecognitionColumns = (cols, options = {}) => {
  const { hideYear = false } = options;
  const filteredCols = mergeLocationColumns(hideYear
    ? (cols || []).filter((col) => col !== "Año")
    : (cols || []));
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

const formatCategoryText = (value) => {
  if (!value) return "-";
  const text = String(value).trim();
  return text.toLowerCase().startsWith("d") ? text : `D${text}`;
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
      : tone === "green"
        ? {
            border: "1px solid rgb(187, 247, 208)",
            backgroundColor: "rgb(240, 253, 244)",
            color: "rgb(21, 128, 61)",
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
        alignItems: columns > 1 ? undefined : fullWidth ? "stretch" : "center",
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
            whiteSpace: "normal",
            width: fullWidth ? "100%" : "auto",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            overflowWrap: "anywhere",
          }}
        >
          {item}
        </Box>
      ))}
    </Box>
  );
};

const renderCellValue = (row, colKey, aliases = {}, options = {}) => {
  const { plainClassification = false } = options;

  if (colKey === LOCATION_COLUMN) {
    return getLocationValue(row) || "-";
  }

  if (colKey === RECOGNITIONS_COLUMN) {
    const certificationValue = getFirstColumnValue(row, isCertificationColumn);
    const accreditationValue = getFirstColumnValue(row, isAccreditationColumn);

    if (!certificationValue && !accreditationValue) return "-";

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.75,
          minWidth: 0,
          width: "100%",
        }}
      >
        {certificationValue ? renderBadges(certificationValue, "green", true, 3) : null}
        {accreditationValue ? renderBadges(accreditationValue, "blue", true, 3) : null}
      </Box>
    );
  }

  if (colKey === "Star") {
    return row[colKey] ? (
      <Rating
        value={Number(row[colKey])}
        readOnly
        size="small"
        icon={<StarRoundedIcon fontSize="inherit" />}
        emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
        sx={{
          fontSize: "1.25rem",
          "& .MuiRating-iconFilled": {
            color: "#facc15",
          },
          "& .MuiRating-iconEmpty": {
            color: "#fbbf24",
            opacity: 0.45,
          },
        }}
      />
    ) : (
      "-"
    );
  }

  if (isCategoryColumn(colKey) || isCategoryColumn(aliases[colKey])) {
    const value = row[colKey] ?? getFirstColumnValue(row, isCategoryColumn);
    if (plainClassification) return formatCategoryText(value);
    return renderCategory(value);
  }

  if (isQualificationColumn(colKey) || isQualificationColumn(aliases[colKey])) {
    const value = row[colKey] ?? getFirstColumnValue(row, isQualificationColumn);
    if (plainClassification) return value || "-";
    return renderBadges(value, "yellow");
  }

  if (isAccreditationColumn(colKey)) {
    return renderBadges(row[colKey], "blue");
  }

  if (isCertificationColumn(colKey)) {
    return renderBadges(row[colKey], "green");
  }

  if (isSchoolNameColumn(colKey) || isSchoolNameColumn(aliases[colKey])) {
    return cleanSchoolName(row[colKey]) || "-";
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
        <TableCell sx={{ width: 42, maxWidth: 42, pl: 1.5, pr: 0.5, py: 1 }}>
          {hasHistory && isLinked ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "#dc2626",
                color: "#fff",
                p: 0,
                "&:hover": {
                  backgroundColor: "#b91c1c",
                },
                "& .MuiSvgIcon-root": {
                  fontSize: "1rem",
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
            <Box sx={{ width: 24 }} />
          )}
        </TableCell>
        {columns.map((colKey) => (
          <TableCell
            key={colKey}
            component="th"
            scope="row"
            sx={{
              ...getTableCellSx(colKey),
              color: !hasHistory ? "#9ca3af" : "inherit",
            }}
          >
            {renderCellValue(row, colKey, aliases, {
              plainClassification: !isLinked && isClassificationColumn(colKey, aliases),
            })}
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
                component="div"
                sx={{
                  width: "fit-content",
                  mx: "auto",
                  mb: 1.5,
                  px: 2,
                  py: 0.75,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.75,
                  borderRadius: "999px",
                  border: "1px solid rgb(254, 202, 202)",
                  backgroundColor: "rgb(254, 242, 242)",
                  color: "rgb(185, 28, 28)",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                }}
              >
                <HistoryRoundedIcon sx={{ fontSize: "1.1rem" }} />
                Historial
              </Typography>

              {/* TABLA DE HISTORIAL */}
              <Table size="small" aria-label="history" sx={{ tableLayout: "fixed", width: "100%" }}>
                <TableHead>
                  <TableRow>
                    {displayHistoryColumns.map((colKey) => (
                      <TableCell
                        key={colKey}
                        sx={{
                          ...getTableCellSx(colKey),
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          color: "#666",
                          textAlign: "center",
                        }}
                      >
                        {getColumnLabel(colKey, aliases)}
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
                              ...getTableCellSx(colKey),
                              fontSize: "0.8rem",
                              textAlign: "center",
                              verticalAlign: "middle",
                              "& > .MuiBox-root": {
                                marginLeft: "auto",
                                marginRight: "auto",
                                alignItems: "center",
                              },
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

  // Memo: Filas visibles (ordenadas)
  const visibleRows = React.useMemo(() => {
    if (data.length === 0) return [];

    return stableSort(data, getComparator(order, orderBy));
  }, [data, order, orderBy]);

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
      <TableContainer sx={{ width: "100%", overflowX: "hidden" }}>
        <Table aria-label="collapsible table" sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ width: 42, maxWidth: 42, pl: 1.5, pr: 0.5 }} />
              {displayColumns.map((colKey) => (
                <TableCell
                  key={colKey}
                  sortDirection={orderBy === colKey ? order : false}
                  sx={{
                    ...getTableCellSx(colKey),
                    fontWeight: "bold",
                    fontSize: { xs: "0.72rem", sm: "0.8rem" },
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === colKey}
                    direction={orderBy === colKey ? order : "asc"}
                    onClick={createSortHandler(colKey)}
                    sx={{
                      gap: 0.5,
                      justifyContent: "center",
                      width: "100%",
                      minWidth: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      "& .MuiTableSortLabel-icon": {
                        opacity: 1,
                        color: orderBy === colKey ? "#b91c1c !important" : "#9ca3af !important",
                        fontSize: "1.15rem",
                      },
                      "&:hover .MuiTableSortLabel-icon": {
                        color: "#b91c1c !important",
                      },
                    }}
                  >
                    {getColumnLabel(colKey, aliases)}
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
    </Paper>
  );
}
