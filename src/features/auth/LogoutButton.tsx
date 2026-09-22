import { useServerFn } from "@tanstack/react-start";
import { signOutStudent } from "@/features/auth/session";

export function LogoutButton() {
  const signOut = useServerFn(signOutStudent);

  return (
    <button
      className="w-full rounded-full border border-white/12 px-3 py-2 text-xs font-semibold text-on-surface-variant transition hover:border-white/24 hover:text-on-surface"
      onClick={() => {
        void signOut();
      }}
      type="button"
    >
      Log out
    </button>
  );
}
