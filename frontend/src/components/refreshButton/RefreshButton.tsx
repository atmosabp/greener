import "./RefreshButton.css";

interface RefreshButtonProps {
  handleRefresh: () => void;
  loading: any;
}

export default function RefreshButton({
  handleRefresh,
  loading,
}: RefreshButtonProps) {
  return (
    <button
      type="button"
      className={`refresh-button ${loading} ? "blocked" : ""`}
      onClick={handleRefresh}
      disabled={loading}
      aria-label="Atualizar horário da última atualização"
      title="Atualizar"
    >
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 7v5h-5" />
        <path d="M4 17v-5h5" />
        <path d="M5.6 9a7 7 0 0 1 11.6-2L20 12" />
        <path d="M4 12l2.8 5a7 7 0 0 0 11.6-2" />
      </svg>
    </button>
  );
}
