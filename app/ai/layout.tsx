import { Navbar } from "@/components/navbar";

const AiLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="pl-[10vw] pr-[5vw] lg:px-[5vw] pt-24 h-full">
        {children}
      </main>
    </div>
  );
};

export default AiLayout;
