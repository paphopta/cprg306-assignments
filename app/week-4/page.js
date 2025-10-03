import { ItemList } from "./item-list.js";

export default function Page() {
  return (
    <main>
      <div className="w-full p-2 m-2 flex flex-col items-center">
        <p className="font-bold text-2xl w-full max-w-96">Add New Item</p>
        <div className="w-full max-w-96">
          <ItemList />
        </div>
      </div>
    </main>
  );
}