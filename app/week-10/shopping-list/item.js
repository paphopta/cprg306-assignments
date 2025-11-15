export function Item({name, quantity, category, onSelect}) {
  return (
    <div
      className="border-0 border-solid rounded-md p-2 my-2 bg-orange-100"
      onClick={() => onSelect({ name })}
      style={{ cursor: "pointer" }}
    >
      <p>{name}</p>
      <p>Quantity: {quantity}</p>
      <p>Category: {category}</p>
    </div>
  );
}