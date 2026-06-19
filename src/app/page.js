import Banner from "@/Components/Banner"; 
import Featured from "@/Components/Featured"; 

export default function Home() {
  return (
    <div className="w-full space-y-12 pb-12">

      <div className="w-full">
        <Banner />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full space-y-12">
        <Featured />
      </div>

    </div>
  );
}