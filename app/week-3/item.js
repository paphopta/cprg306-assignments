export function Item({name, quantity, category}) {
  return (
    <div className="border-0 border-solid rounded-md p-2 my-2 bg-green-100">
      <p>{name}</p>
      <p>Quantity: {quantity}</p>
      <p>Category: {category}</p>
    </div>
  );
}