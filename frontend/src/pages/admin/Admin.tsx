
import { useCallback, useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import CadHeader from "../../components/header/CadHeader";
import CadForm from "../../components/form/CadForm";
import AltForm from "../../components/form/AltForm";
import Toast from "../../components/toast/Toast";
import Warning from "../../components/warning/Warning";
import type { FormValues } from "../../types/form";
import type { ToastIcon } from "../../types/toast";
import "./Admin.css";

interface User {
  id: number;
  name: string;
  email: string;
  is_adm?: boolean;
}

interface ToastState {
  id: number;
  icon: ToastIcon;
  title: string;
  message?: string;
}

// Rotas de usuários do back.
const USERS_URL = `http://localhost:${import.meta.env.VITE_PORT}/users`;

// Representa os erros que podem acontecer durante uma requisição.
class RequestError extends Error {
  public type: "network" | "http" = "http";
  public status?: number = 0;

  constructor(
    type: "network" | "http",
    message: string,
    status?: number,
  ) {
    super(message);
    this.name = "RequestError";
    this.type = type;
    this.status = status;
  }
}

// Faz requisições ao backend e identifica erros de conexão e HTTP.
async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  let result: Response;

  try {
    result = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      ...options,
    });
  } catch {
    throw new RequestError(
      "network",
      "Não foi possível conectar ao servidor. Verifique sua conexão.",
    );
  }

  const data = await result.json().catch(() => null);

  if (!result.ok) {
    const statusMessages: Record<number, string> = {
      400: "Verifique os dados informados.",
      401: "Sua sessão expirou. Faça login novamente.",
      403: "Você não tem permissão para realizar esta ação.",
      409: "Já existe um usuário com esse e-mail.",
      429: "Aguarde alguns minutos antes de tentar novamente.",
      500: "Ocorreu um erro interno no servidor.",
      502: "O servidor está temporariamente indisponível.",
      503: "O servidor está temporariamente indisponível.",
      504: "O servidor demorou para responder. Tente novamente.",
    };

    const message =
      typeof data?.message === "string"
        ? data.message
        : statusMessages[result.status] ||
        "Não foi possível concluir a operação. Tente novamente.";

    throw new RequestError("http", message, result.status);
  }

  return data as T;
}

// Extrai a mensagem de um erro de forma segura para o TypeScript.
const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : undefined;

// Opções do seletor "Mostrando X por página".
const PAGE_SIZES = [5, 10, 15, 20, 50];

// Completa com zeros à esquerda.
const pad = (n: number, size = 3) => String(n).padStart(size, "0");

// Escolhe a saudação de acordo com a hora do dia.
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

// Devolve uma cópia do Set com o id adicionado ou removido.
function toggle(set: Set<number>, id: number) {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
}

// Checkbox customizado.
function Checkbox({ checked, indeterminate = false, onChange }: CheckboxProps) {
  return (
    <span className="check">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate;
        }}
      />
      <span className={`check-box${indeterminate ? " is-mixed" : ""}`}>
        <Check strokeWidth={3.5} />
      </span>
    </span>
  );
}

interface ActionProps {
  name: string;
  disabled: boolean;
  onClick: () => void;
}

// Botão de edição.
function EditButton({ disabled, onClick }: ActionProps) {
  return (
    <button
      type="button"
      className="icon-btn icon-btn-edit"
      disabled={disabled}
      onClick={onClick}
    >
      <Pencil />
    </button>
  );
}

// Botão de exclusão.
function DeleteButton({ disabled, onClick }: ActionProps) {
  return (
    <button
      type="button"
      className="icon-btn icon-btn-delete"
      disabled={disabled}
      onClick={onClick}
    >
      <Trash />
    </button>
  );
}

// Aparece quando não há nenhum usuário para mostrar.
function EmptyState() {
  return (
    <div className="empty">
      <svg
        className="empty-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21v-8" />
        <path d="M12 13c0-4-3-6-7-6 0 4 3 6 7 6z" />
        <path d="M12 11c0-3.5 2.5-6 7-6 0 3.5-2.5 6-7 6z" />
      </svg>
      <strong>Nenhum usuário cadastrado</strong>
      <span>Use o botão Adicionar para criar o primeiro acesso.</span>
    </div>
  );
}

export default function Admin() {
  const [userName, _setUserName] = useState<string>(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return "usuário";
    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser.name || "usuário";
    } catch (e) {
      return "usuário";
    }
  });

  const [users, setUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [openRows, setOpenRows] = useState<Set<number>>(new Set());
  const [openCadModal, setOpenCadModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteIds, setDeleteIds] = useState<number[] | null>(null);
  const [pageSize, setPageSize] = useState(() =>
    window.matchMedia("(max-width: 480px)").matches ? 5 : 10,
  );
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const allOnPageSelected =
    pageUsers.length > 0 && pageUsers.every((u) => selected.has(u.id));
  const someOnPageSelected = pageUsers.some((u) => selected.has(u.id));

  // Marca ou desmarca todos os usuários da página atual.
  const toggleSelectAll = () => {
    const next = new Set(selected);
    for (const u of pageUsers) {
      if (allOnPageSelected) next.delete(u.id);
      else next.add(u.id);
    }
    setSelected(next);
  };

  const showToast = (icon: ToastIcon, title: string, message?: string) =>
    setToast({ id: Date.now(), icon, title, message });

  // Evita que o Toast reinicie o timer a cada render.
  const closeToast = useCallback(() => setToast(null), []);

  // Busca a lista de usuários no backend.
  async function getUsers(): Promise<void> {
    try {
      const data = await request<User[] | null>(`${USERS_URL}/get-users`);
      setUsers(data ?? []);
    } catch (e) {
      showToast("error", "Erro ao carregar usuários", errorMessage(e));
    }
  }

  // Carrega a lista ao abrir a tela.
  useEffect(() => {
    const fetchData = async () => {
      await getUsers();
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addUser = () => {
    setOpenCadModal(true);
  };

  const editUser = (user: User) => {
    setEditingUser(user);
  };

  // Abre o aviso de confirmação antes de deletar.
  const deleteUsers = (ids: number[]) => {
    setDeleteIds(ids);
  };

  // Cadastra um novo usuário.
  async function createUser(values: FormValues): Promise<void> {
    if (saving) return;

    setSaving(true);

    try {
      await request(USERS_URL, {
        method: "POST",
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
          isAdm: false,
        }),
      });

      setOpenCadModal(false);

      showToast(
        "success",
        "Usuário cadastrado",
        `${values.name.trim()} já pode acessar a plataforma.`,
      );

      await getUsers();
    } catch (e) {
      if (e instanceof RequestError) {
        // Falha de conexão.
        if (e.type === "network") {
          showToast(
            "error",
            "Falha na conexão",
            "Não foi possível conectar ao servidor. Verifique sua conexão.",
          );
          return;
        }

        // Erros retornados pelo backend.
        switch (e.status) {
          case 400:
            showToast(
              "error",
              "Dados incorretos",
              e.message || "Verifique os dados informados.",
            );
            break;

          case 401:
            showToast(
              "error",
              "Sessão expirada",
              "Sua sessão expirou. Faça login novamente.",
            );
            break;

          case 403:
            showToast(
              "error",
              "Acesso negado",
              "Você não tem permissão para cadastrar usuários.",
            );
            break;

          case 409:
            showToast(
              "error",
              "E-mail já cadastrado",
              e.message || "Já existe um usuário com esse e-mail.",
            );
            break;

          case 429:
            showToast(
              "error",
              "Muitas tentativas",
              "Aguarde alguns minutos antes de tentar novamente.",
            );
            break;

          case 500:
          case 502:
          case 503:
          case 504:
            showToast(
              "error",
              "Servidor indisponível",
              "Tente novamente mais tarde.",
            );
            break;

          default:
            showToast(
              "error",
              "Erro ao cadastrar",
              e.message || "Não foi possível cadastrar o usuário.",
            );
            break;
        }
      } else {
        showToast(
          "error",
          "Erro ao cadastrar",
          errorMessage(e) || "Ocorreu um erro inesperado. Tente novamente.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  // Altera os dados de um usuário.
  async function updateUser(values: FormValues): Promise<void> {
    if (!editingUser || saving) return;
    setSaving(true);

    // Senha vazia significa manter a senha atual.
    const body: Record<string, string> = {
      name: values.name.trim(),
      email: values.email.trim(),
    };
    if (values.password) body.password = values.password;

    try {
      await request(`${USERS_URL}/${editingUser.id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setEditingUser(null);
      showToast("success", "Usuário alterado", "Os dados foram salvos.");
      await getUsers();
    } catch (e) {
      showToast("error", "Erro ao alterar", errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  // Confirma a exclusão dos usuários selecionados.
  async function confirmDelete(): Promise<void> {
    if (!deleteIds || saving) return;
    const ids = deleteIds;
    setDeleteIds(null);
    setSaving(true);

    // O backend deleta um por vez, então dispara todos juntos.
    const results = await Promise.allSettled(
      ids.map((id) => request(`${USERS_URL}/${id}`, { method: "DELETE" })),
    );
    const failed = results.filter((r) => r.status === "rejected").length;

    if (failed === 0) {
      showToast(
        "success",
        ids.length > 1 ? "Usuários deletados" : "Usuário deletado",
      );
    } else {
      showToast(
        "error",
        "Erro ao deletar",
        `${failed} de ${ids.length} usuário(s) não puderam ser deletados.`,
      );
    }

    setSelected(new Set());
    setSaving(false);
    await getUsers();
  }

  return (
    <div className="admin-page">
      {toast && (
        <Toast
          key={toast.id}
          icon={toast.icon}
          title={toast.title}
          message={toast.message}
          onClose={closeToast}
        />
      )}

      {/* Modais de cada ação. */}

      {openCadModal && (
        <CadForm
          onSave={createUser}
          onClose={() => setOpenCadModal(false)}
          isSubmitting={saving}
        />
      )}

      {editingUser && (
        <AltForm
          user={editingUser}
          onSave={updateUser}
          onClose={() => setEditingUser(null)}
        />
      )}

      {deleteIds && (
        <Warning
          variant="delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteIds(null)}
        />
      )}

      <CadHeader />

      <main className="admin">
        <div className="start-section">
          <h1>
            {getGreeting()}, {userName}.
          </h1>
          <p>Crie, altere e exclua usuários de acesso restrito.</p>
        </div>

        <section className="users">
          <div className="toolbar">
            <h2 id="users-title">Usuários</h2>

            <div className="toolbar-btns">
              <div className="total">
                <span>Total de usuários:</span>
                <strong>{users.length}</strong>
              </div>

              <button
                type="button"
                className="btn btn-delete"
                disabled={selected.size === 0}
                onClick={() => deleteUsers([...selected])}
              >
                <Trash />
                <span className="btn-label">Deletar</span>
              </button>

              <button type="button" className="btn btn-add" onClick={addUser}>
                <Plus />
                <span className="btn-label">Adicionar</span>
              </button>
            </div>
          </div>

          {/* Tabela (desktop). */}
          <table className="table">
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "41%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">
                  <div className="cell-id">
                    <Checkbox
                      checked={allOnPageSelected}
                      indeterminate={someOnPageSelected && !allOnPageSelected}
                      onChange={toggleSelectAll}
                      label="Selecionar todos desta página"
                    />
                    <span>ID</span>
                  </div>
                </th>
                <th scope="col">Nome</th>
                <th scope="col">Email</th>
                <th scope="col">Editar</th>
                <th scope="col">Excluir</th>
              </tr>
            </thead>

            <tbody>
              {pageUsers.length === 0 ? (
                <tr className="table-empty">
                  <td colSpan={5}>
                    <EmptyState />
                  </td>
                </tr>
              ) : (
                pageUsers.map((u) => {
                  const isSelected = selected.has(u.id);
                  return (
                    <tr
                      key={u.id}
                      className={isSelected ? "is-selected" : undefined}
                    >
                      <td>
                        <div className="cell-id">
                          <Checkbox
                            checked={isSelected}
                            onChange={() =>
                              setSelected(toggle(selected, u.id))
                            }
                            label={`Selecionar ${u.name}`}
                          />
                          <span>{pad(u.id)}</span>
                        </div>
                      </td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <EditButton
                          name={u.name}
                          disabled={isSelected}
                          onClick={() => editUser(u)}
                        />
                      </td>
                      <td>
                        <DeleteButton
                          name={u.name}
                          disabled={isSelected}
                          onClick={() => deleteUsers([u.id])}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Lista expansível (mobile). */}
          <div className="m-card">
            {pageUsers.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="m-list">
                {pageUsers.map((u) => {
                  const isSelected = selected.has(u.id);
                  const isOpen = openRows.has(u.id);
                  return (
                    <li
                      key={u.id}
                      className={`m-item${isSelected ? " is-selected" : ""}${isOpen ? " is-open" : ""}`}
                    >
                      <div className="m-head">
                        <button
                          type="button"
                          className="m-toggle"
                          onClick={() => setOpenRows(toggle(openRows, u.id))}
                        >
                          <ChevronDown />
                        </button>

                        {/* Tocar no nome seleciona o usuário. */}
                        <label className="m-label">
                          <input
                            type="checkbox"
                            className="checkbox-user"
                            checked={isSelected}
                            onChange={() =>
                              setSelected(toggle(selected, u.id))
                            }
                          />
                          <span className="m-key">Nome</span>
                          <span className="m-val">{u.name}</span>
                        </label>
                      </div>

                      <div className="m-details" id={`m-details-${u.id}`}>
                        <div className="m-details-inner">
                          <div className="m-row">
                            <span className="m-key">ID</span>
                            <span className="m-val">{pad(u.id)}</span>
                          </div>
                          <div className="m-row">
                            <span className="m-key">Email</span>
                            <span className="m-val">{u.email}</span>
                          </div>
                          <div className="m-row">
                            <span className="m-key">Ações</span>
                            <span className="m-actions">
                              <EditButton
                                name={u.name}
                                disabled={isSelected}
                                onClick={() => editUser(u)}
                              />
                              <DeleteButton
                                name={u.name}
                                disabled={isSelected}
                                onClick={() => deleteUsers([u.id])}
                              />
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Paginação. */}
          <div className="table-footer">
            <label className="per-page">
              <span>Mostrando</span>
              <span className="select">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {pad(size, 2)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="select-icon" />
              </span>
              <span>por página</span>
            </label>

            <div className="pager">
              <button
                type="button"
                className="pager-btn pager-btn-prev"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft />
              </button>

              <span className="pager-count" key={currentPage}>
                {currentPage}/{totalPages}
              </span>

              <button
                type="button"
                className="pager-btn pager-btn-next"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="admin-footer">Desenvolvido por Atmos © 2026</footer>
    </div>
  );
}