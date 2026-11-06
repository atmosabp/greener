import { useState } from "react";
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
import "./Admin.css";

interface User {
  id: number;
  name: string;
  email: string;
}

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
function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  label,
}: CheckboxProps) {
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
function EditButton({ name, disabled, onClick }: ActionProps) {
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
function DeleteButton({ name, disabled, onClick }: ActionProps) {
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
  // dados de teste, trocar pela lista vazia quando integrar com o back:
  // useState<User[]>([])
  const [users] = useState<User[]>([
    { id: 1, name: "Beatriz", email: "bia@gmail.com" },
    { id: 2, name: "Darcy", email: "darcy@gmail.com" },
    { id: 3, name: "Júlia", email: "julia@gmail.com" },
    { id: 4, name: "Kauã", email: "kaua@gmail.com" },
    { id: 5, name: "Lorenzo", email: "lorenzo@gmail.com" },
    { id: 6, name: "Mariana", email: "mari@gmail.com" },
    { id: 7, name: "falecido Tech Fellas", email: "techfellas@gmail.com" },
    { id: 8, name: "Atmos abp", email: "atmos@gmail.com" },
  ]);

  const [selected, setSelected] = useState<Set<number>>(new Set()); // ids marcados
  const [openRows, setOpenRows] = useState<Set<number>>(new Set()); // linhas abertas no mobile
  const [openCadModal, setOpenCadModal] = useState<boolean>(false); // abre o modal de cadastro
  const [openAltModal, setOpenAltModal] = useState<boolean>(false); // abre o modal de alterar user
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

  // TODO: abrir modal de cadastro
  const addUser = () => {
    setOpenCadModal(true);
  };

  // TODO: abrir modal de alteração
  const editUser = () => {
    setOpenAltModal(true);
  };

  // TODO: integrar com o back
  const deleteUsers = (ids: number[]) => {
    console.log("deletar usuários:", ids);
    setSelected(new Set());
  };

  return (
    <div className="admin-page">
      {openCadModal && <CadForm onClose={() => setOpenCadModal(false)} />}

      {/* TODO: fazer alteração aqui */}
      {openAltModal && (
        <AltForm user={{ name: "bia", email: "bia@gmail.com" }} onClose={() => setOpenAltModal(false)}/>
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
                            onClick={() => editUser()}
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
                                onClick={() => editUser()}
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
