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
  id: number; // muda a cada toast, para o React recriar o componente
  icon: ToastIcon;
  title: string;
  message?: string;
}

// rotas de usuários do back (ver docs/endpoints.md)
const USERS_URL = `http://localhost:${import.meta.env.VITE_PORT}/users`;

// faz o fetch e, se o back responder erro, lança a mensagem que ele mandou
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const result = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    ...options,
  });
  const data = await result.json().catch(() => null);

  if (!result.ok) {
    throw new Error(data?.message || "Não foi possível falar com o servidor.");
  }
  return data as T;
}

// pega a mensagem de um erro de forma segura para o TypeScript
const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : undefined;

// opções do seletor "Mostrando X por página"
const PAGE_SIZES = [5, 10, 15, 20, 50];

// completa com zeros à esquerda: pad(7) -> "007", pad(5, 2) -> "05"
const pad = (n: number, size = 3) => String(n).padStart(size, "0");

// escolhe a saudação de acordo com a hora do dia
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

// devolve uma cópia do Set com o id adicionado (ou removido, se já estava).
// Precisa ser uma cópia porque o React só re-renderiza se o objeto for novo.
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

// Checkbox customizado: o input de verdade fica invisível por cima e o span
// desenha a caixinha. O "indeterminate" é o traço do cabeçalho quando só
// alguns itens estão marcados. Ele só pode ser definido via JS, por isso o ref.
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

// botão de lápis (usado na tabela e na lista mobile)
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

// botão de lixeira de uma linha só (usado na tabela e na lista mobile)
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

// aparece quando não há nenhum usuário para mostrar
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
  const [users, setUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState<boolean>(false); // evita enviar duas vezes
  const [toast, setToast] = useState<ToastState | null>(null);

  const [selected, setSelected] = useState<Set<number>>(new Set()); // ids marcados
  const [openRows, setOpenRows] = useState<Set<number>>(new Set()); // linhas abertas no mobile
  const [openCadModal, setOpenCadModal] = useState<boolean>(false); // abre o modal de cadastro
  const [editingUser, setEditingUser] = useState<User | null>(null); // usuário no modal de alterar
  const [deleteIds, setDeleteIds] = useState<number[] | null>(null); // ids aguardando confirmação
  const [pageSize, setPageSize] = useState(() =>
    window.matchMedia("(max-width: 480px)").matches ? 5 : 10,
  );
  const [page, setPage] = useState(1);

  const userName = "Beatriz"; // TODO: vir da autenticação

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const allOnPageSelected =
    pageUsers.length > 0 && pageUsers.every((u) => selected.has(u.id));
  const someOnPageSelected = pageUsers.some((u) => selected.has(u.id));

  // checkbox do cabeçalho: marca ou desmarca todos os usuários da página atual
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

  // useCallback para o Toast não reiniciar o timer a cada render
  const closeToast = useCallback(() => setToast(null), []);

  // busca a lista de usuários no back
  async function getUsers(): Promise<void> {
    try {
      const data = await request<User[] | null>(`${USERS_URL}/get-users`);
      setUsers(data ?? []);
    } catch (e) {
      showToast("error", "Erro ao carregar usuários", errorMessage(e));
    }
  }

  // carrega a lista ao abrir a tela
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

  // abre o aviso de confirmação antes de deletar
  const deleteUsers = (ids: number[]) => {
    setDeleteIds(ids);
  };

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
      showToast("error", "Erro ao cadastrar", errorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function updateUser(values: FormValues): Promise<void> {
    if (!editingUser || saving) return;
    setSaving(true);

    // a senha só vai se a pessoa preencheu (vazio = manter a atual)
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

  async function confirmDelete(): Promise<void> {
    if (!deleteIds || saving) return;
    const ids = deleteIds;
    setDeleteIds(null);
    setSaving(true);

    // o back deleta um por vez, então dispara todos juntos
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

      {/* Aqui está a lógica de aparecer os modais em cada ação */}

      {openCadModal && (
        <CadForm onSave={createUser} onClose={() => setOpenCadModal(false)} />
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

          {/* tabela (desktop) */}
          {/* <div className="table-card table-card-desktop"> */}
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
                            onChange={() => setSelected(toggle(selected, u.id))}
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
          {/* </div> */}

          {/* lista expansível (mobile) */}
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

                        {/* tocar no nome seleciona o usuário */}
                        <label className="m-label">
                          <input
                            type="checkbox"
                            className="checkbox-user"
                            checked={isSelected}
                            onChange={() => setSelected(toggle(selected, u.id))}
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

          {/* paginação */}
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
              {/* o key faz o React recriar o elemento e repetir a animação a cada página */}
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
