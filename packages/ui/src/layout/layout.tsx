import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div className="flex flex-row gap-2">
        <button className="w-[300px]" onClick={() => navigate("/")}>PC Builder</button>
        <button className="w-[300px]" onClick={() => navigate("/leaderboard")}>
          Parts Leaderboard
        </button>
      </div>

      <div className="flex flex-row w-full h-[95%]">
        {children}
        </div>
    </div>
  );
}
