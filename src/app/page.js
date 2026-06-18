import Image from "next/image";

import Banner from "@/Components/Banner"; 

export default function Home() {
  return (
    <div className="w-full space-y-6">
      
      <Banner userName="Alex" />
    </div>
  );
}