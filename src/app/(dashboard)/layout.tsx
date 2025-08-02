import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calenme",
  description: "A way to organize the life",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        header
      </div>
      <div>
        sidebar
      </div>
      <div>
      {children}
      </div>
      <div>footer</div>
    </div>
  );
}
