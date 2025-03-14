export function InventoryPrintView({
  inventory,
  apartment,
  building,
}: {
  inventory: any;
  apartment: any;
  building: any;
}) {
  return (
    <div className="print-area">
      {/* Header */}
      <header className="text-center mt-4 flex justify-between gap-x-6 items-center mx-8">
        <img src="/assets/logo.png" alt="Logo" className="h-16 mx-auto" />
        <p className="text-sm mt-2">Entreprise Logevac, Immeuble les Soldanelles, 083665652323</p>
        <p className="text-sm">Email: contact@logevac.com</p>
      </header>

      {/* Title */}
      <h1 className="text-center text-2xl font-bold my-2">
        Inventaire du logement {apartment.name} ({apartment.type}) - {building.name}
      </h1>

      {/* Inventory Table */}
      <section>
        <div className="grid grid-cols-2 gap-1 px-2">
          {inventory.categories.map((category: any) => (
            <div key={category.id} className="border border-gray-300 px-4 py-2 rounded-lg">
              <h2 className="text-lg font-semibold mb-1">{category.name}</h2>
              <ul className="list-disc pl-3">
                {category.items.map((item: any) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm mt-8">
        <p>Entreprise Logevac, Tous droits réservés.</p>
        <p>Si tu vois ce message c'est que YOU MADE IT BRO</p>
      </footer>
    </div>
  );
}
