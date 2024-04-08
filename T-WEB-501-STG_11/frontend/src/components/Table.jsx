import { useEffect, useMemo, useState } from "react";
import {
  Table as NextTable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Pagination,
  useDisclosure,
  RadioGroup,
  Radio,
  Button,
  Spinner,
} from "@nextui-org/react";
import { EditIcon } from "./Icons/EditIcon";
import { DeleteIcon } from "./Icons/DeleteIcon";
import Swal from "sweetalert2";
import { API_URL, headers } from "JQ/services/constants";
import UserModal from "./admin/UserModal";
import JobModal from "./admin/JobModal";
import CompanyModal from "./admin/CompanyModal";
import DefaultModal from "./admin/DefaultModal";

export default function Table({ rows, name }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [action, setAction] = useState("add");
  const [targetId, setTargetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([{}]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    setColumns([{}]);
    if (rows.length === 0) {
      setLoading(false);
      return;
    }

    let row = rows[0];
    let keys = Object.keys(row);
    let columns = [];

    for (let key of keys) {
      let formattedKey = key.replace(/_/g, " ");
      formattedKey =
        formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
      if (!columns.find((column) => column.key === key)) {
        columns.push({ key, label: formattedKey });
      }
    }

    setPages(Math.ceil(rows.length / rowsPerPage));
    setColumns([
      ...columns,
      {
        key: "actions",
        label: "Actions",
      },
    ]);

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [rows]);

  const items = useMemo(() => {
    const [from, to] = [
      (page - 1) * rowsPerPage,
      (page - 1) * rowsPerPage + rowsPerPage,
    ];
    return rows.slice(from, to);
  }, [rows, page]);

  const deleteItem = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${name.slice(0, -1)} with id #${id}?`,
      icon: "warning",
      showCancelButton: true,
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_URL}/${name}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then((res) => {
          console.log(res);
          if (res.status === 204) {
            Swal.fire({
              title: "Deleted!",
              text: `${name.slice(0, -1)} with id #${id} has been deleted.`,
              icon: "success",
              preConfirm: () => {
                location.reload();
              },
            });
          }
        });
      }
    });
  };

  const title = () => {
    let formattedName = name.slice(0, -1).replace("ie", "y");
    return targetId
      ? `Update ${formattedName} #${targetId}`
      : `Add ${formattedName}`;
  };

  const globalModalProps = {
    isOpen,
    onOpenChange,
    action,
    title,
    targetId,
  };

  const modalsNames = [
    "users",
    "jobs",
    "companies",
    "regions",
    "types",
    "workplaces",
  ];

  const modals = [
    {
      key: "users",
      component: <UserModal {...globalModalProps} />,
    },
    {
      key: "jobs",
      component: <JobModal {...globalModalProps} />,
    },
    {
      key: "companies",
      component: <CompanyModal {...globalModalProps} />,
    },
  ];

  const newItem = () => {
    setAction("add");
    setTargetId(null);
    onOpen(true);
  };

  const editItem = (id) => {
    setAction("edit");
    setTargetId(id);
    onOpen(true);
  };

  return loading ? (
    <Spinner />
  ) : (
    <>
      {isOpen
        ? modalsNames.includes(name)
          ? modals.find((modal) => modal.key === name)?.component || (
              <DefaultModal name={name} {...globalModalProps} />
            )
          : null
        : null}
      {modalsNames.includes(name) ? (
        <div className="mt-2 mb-2 w-full flex justify-end">
          <Button onClick={newItem} color="primary">
            Add new item
          </Button>
        </div>
      ) : null}
      <NextTable aria-label="Example empty table" isHeaderSticky>
        <TableHeader>
          {columns.map((column) => {
            return <TableColumn key={column.key}>{column.label}</TableColumn>;
          })}
        </TableHeader>
        <TableBody emptyContent={"No rows to display."} items={items}>
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey) => (
                <TableCell key={columnKey}>
                  {typeof item[columnKey] === "object" ? (
                    item[columnKey]?.label || item[columnKey]?.id
                  ) : columnKey === "is_admin" ? (
                    <Chip
                      color={item[columnKey] ? "success" : "default"}
                      variant="flat"
                    >
                      {item[columnKey] ? "Admin" : "User"}
                    </Chip>
                  ) : columnKey === "created_at" ||
                    columnKey === "updated_at" ? (
                    new Date(item[columnKey]).toLocaleDateString()
                  ) : columnKey === "description" ? (
                    item[columnKey]?.slice(0, 20) + "..."
                  ) : columnKey === "actions" ? (
                    <div className="relative flex items-center gap-2">
                      {modalsNames.includes(name) ? (
                        <Tooltip content="Edit">
                          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <EditIcon
                              width="18"
                              height="18"
                              data-id={item.id}
                              onClick={() => editItem(item.id)}
                            />
                          </span>
                        </Tooltip>
                      ) : null}
                      <Tooltip color="danger" content="Delete">
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <DeleteIcon
                            width="18"
                            onClick={() => deleteItem(item.id)}
                            height="18"
                            data-id={item.id}
                          />
                        </span>
                      </Tooltip>
                    </div>
                  ) : (
                    item[columnKey]
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </NextTable>
      <div className="mt-2 flex w-full justify-center">
        <Pagination
          style={{ backgroundColor: "transparent", boxShadow: "none" }}
          showControls
          page={page}
          total={pages}
          size="lg"
          onChange={(page) => setPage(page)}
        />
      </div>
    </>
  );
}
